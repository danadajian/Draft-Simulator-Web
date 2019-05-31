from src.main.GetPlayers import get_players
from src.main.SimulateDraft import *
from src.main.MLBSalaries import *
from src.main.NBASalaries import *
from src.main.Optimizer import *
# import os
from flask import Flask, render_template, request, redirect, url_for
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from flask_heroku import Heroku
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import InputRequired, Email, Length
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import exc
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Thisissupposedtobesecret!'
# For running postgres locally. Comment out the line below when deploying to heroku:
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/accounts'

# For running postgres in production:
heroku = Heroku(app)
bootstrap = Bootstrap(app)
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


class Users(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(80))
    draft_ranking = db.Column(db.String(10000), unique=False)


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))


class LoginForm(FlaskForm):
    username = StringField('username', validators=[InputRequired(), Length(min=4, max=15)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=80)])
    remember = BooleanField('remember me')


class RegisterForm(FlaskForm):
    email = StringField('email', validators=[InputRequired(), Email(message='Invalid email'), Length(max=50)])
    username = StringField('username', validators=[InputRequired(), Length(min=4, max=15)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=80)])


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        user = Users.query.filter_by(username=form.username.data).first()
        if user:
            if check_password_hash(user.password, form.password.data):
                login_user(user, remember=form.remember.data)
                return redirect(url_for('home'))

        return '<h1>Invalid username or password</h1>' \
               '<h2>Please <a href="login">try again</a>.</h2>'

    return render_template('login.html', form=form)


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = RegisterForm()

    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data, method='sha256')
        new_user = Users(username=form.username.data, email=form.email.data, password=hashed_password,
                         draft_ranking='No ranking specified.')
        try:
            db.session.add(new_user)
            db.session.commit()
        except exc.SQLAlchemyError:
            return '<h1>User already exists.</h1>' \
                   '<h2>Please <a href="signup">try again</a>.</h2>'

        return '<h1>Your account has been created!</h1>' \
               '<h2>Now please <a href="login">login</a>.</h2>'

    return render_template('signup.html', form=form)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route('/')
@login_required
def landing():
    return redirect(url_for('home'))


@app.route("/home")
@login_required
def home():
    return render_template("index.html")


@app.route("/espn")
@login_required
def espn():
    return render_template("index.html")


@app.route("/espn-rankings")
@login_required
def espn_rankings():
    user = Users.query.filter_by(username=current_user.username).first()
    return user.draft_ranking


@app.route("/yahoo")
@login_required
def yahoo():
    return render_template("index.html")


@app.route("/dfs-optimizer")
@login_required
def dfs_optimizer():
    return render_template("index.html")


@app.route("/optimized-lineup/<sport>", methods=['GET', 'POST'])
@login_required
def optimized_team(sport):
    global ignored
    global site
    global fd_ignored
    global dk_ignored
    global fd_black_list
    global dk_black_list
    global fd_lineup
    global dk_lineup
    if request.method == 'POST':
        data = request.get_data()
        clean = str(data)[2:-1]
        ignored = tuple(clean.split('|'))
        if ignored[1] == 'fd':
            site = 'fd'
            fd_ignored = eval(fd_lineup[1:-1].split('}, ')[int(ignored[0])] + '}').get("Player")
        elif ignored[1] == 'dk':
            site = 'dk'
            dk_ignored = eval(dk_lineup[1:-1].split('}, ')[int(ignored[0])] + '}').get("Player")
        return ignored
    else:
        if sport == 'reset':
            ignored = ()
            fd_ignored = ''
            dk_ignored = ''
            fd_black_list = []
            dk_black_list = []
            return ''
        if ignored:
            if site == 'fd':
                print(fd_ignored)
                fd_black_list.append(fd_ignored)
                fd_black_list = list(set(fd_black_list))

            elif site == 'dk':
                print(dk_ignored)
                dk_black_list.append(dk_ignored)
                dk_black_list = list(set(dk_black_list))

        print(ignored)
        print(fd_black_list)
        print(dk_black_list)
        fd_lineup = get_fd_lineup(sport, fd_ignored, fd_black_list + [fd_ignored])
        dk_lineup = get_dk_lineup(sport, dk_ignored, dk_black_list + [dk_ignored])

        return fd_lineup + '|' + dk_lineup


@app.route("/espn-players")
@login_required
def espn_players():
    return get_players()


@app.route("/yahoo-players")
@login_required
def yahoo_players():
    return


@app.route("/draft-results", methods=['GET', 'POST'])
@login_required
def run_draft():
    global draft_results
    if request.method == 'POST':
        draft_results = None
        data = request.get_data()
        clean = str(data)[2:-1]
        data_list = clean.split('|')
        players_string = data_list[0]
        user = Users.query.filter_by(username=current_user.username).first()
        user.draft_ranking = players_string
        db.session.commit()
        replace_list = ['(QB)', '(RB)', '(WR)', '(TE)', '(K)', '(DST)', '    ']
        for item in replace_list:
            players_string = players_string.replace(item, '')
        user_list = players_string.split(',')
        team_count = int(data_list[1])
        pick_order = int(data_list[2])
        round_count = int(data_list[3])
        teams_drafted = simulate_draft(user_list, team_count, pick_order, round_count, 500)
        if teams_drafted == 'Draft error!':
            draft_results = 'Draft error!'
            return draft_results
        player_draft_freq = calculate_frequencies(teams_drafted)
        expected_team = get_expected_team(teams_drafted, round_count)
        ordered_team = order_team(expected_team, player_draft_freq)
        draft_results = aggregate_data(player_draft_freq, user_list) + '|' + ordered_team
        return draft_results
    else:
        try:
            return draft_results
        except NameError:
            return 'Draft results to appear here!'


if __name__ == "__main__":
    app.run()
    # port = int(os.environ.get("PORT", 5000))
    # app.run(host='0.0.0.0', port=port)
