from src.main.GetESPNPlayers import get_espn_players, get_player_dict
from src.main.GetYahooPlayers import get_yahoo_players
from src.main.Simulator import *
from src.main.GetMLBData import get_mlb_projections
from src.main.GetNBAData import get_nba_projections
from src.main.GetNFLData import get_nfl_projections
from src.main.Optimizer import *
from flask import *
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from flask_heroku import Heroku
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import InputRequired, Email, Length
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import exc
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_caching import Cache
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

is_production = os.environ.get('IS_HEROKU', None)
if not is_production:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/accounts'

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
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=15)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=80)])
    remember = BooleanField('Remember Me')


class RegisterForm(FlaskForm):
    email = StringField('Email', validators=[InputRequired(), Email(message='Invalid email'), Length(max=50)])
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=15)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=80)])


@app.route('/')
def landing_page():
    try:
        user = current_user.username
    except AttributeError:
        return render_template('home.html')
    if user:
        return redirect(url_for('home'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    endpoint = request.args.get('next').split('/')[1].replace('-', '_') if request.args.get('next') and request.method == 'GET' else 'home'
    error = 'Incorrect username or password.' if request.form.get('username') and request.form.get('password') else None
    # print(request.form.get('username'), request.form.get('password'), request.method)
    if form.validate_on_submit():
        user = Users.query.filter_by(username=form.username.data).first()
        if user:
            if check_password_hash(user.password, form.password.data):
                login_user(user, remember=form.remember.data)
                return redirect(url_for(endpoint))
    return render_template('login.html', form=form, error=error)


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

        print(request.method)
        return '<h1>Your account has been created!</h1>' \
               '<h2>Now please <a href="login">login</a>.</h2>'

    return render_template('signup.html', form=form)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route("/home")
@login_required
def home():
    return render_template("index.html")


@app.route("/espn")
@login_required
def espn():
    return render_template("index.html")


@app.route("/user-rankings")
@login_required
def espn_rankings():
    user = Users.query.filter_by(username=current_user.username).first()
    return user.draft_ranking


@app.route("/yahoo")
@login_required
def yahoo():
    return render_template("index.html")


@app.route("/saved-ranking", methods=['GET', 'POST'])
@login_required
def save_to_db():
    global user_ranking
    if request.method == 'POST':
        user_ranking = None
        user = Users.query.filter_by(username=current_user.username).first()
        player_list = request.get_data()
        user.draft_ranking = jsonify(player_list)
        db.session.commit()
        return 'User ranking added.'
    else:
        return user_ranking


@app.route("/espn-players")
@login_required
@cache.cached(timeout=86400)
def espn_players():
    return jsonify(get_espn_players())


@app.route("/yahoo-players")
@login_required
@cache.cached(timeout=86400)
def yahoo_players():
    return jsonify(get_yahoo_players())


@app.route("/draft-results", methods=['POST'])
@login_required
def run_draft():
    global draft_results
    data = request.get_data()
    data_list = str(data)[2:-1].split('|')
    players_string, team_count, pick_order, round_count = data_list
    team_count, pick_order, round_count = int(team_count), int(pick_order), int(round_count)
    replace_list = ['(QB)', '(RB)', '(WR)', '(TE)', '(K)', '(DST)', '    ']
    for item in replace_list:
        players_string = players_string.replace(item, '')
    user_list = players_string.split(',')
    draft_results = get_draft_results(user_list, get_player_dict(), team_count, pick_order, round_count)
    return jsonify(draft_results)


@app.route("/dfs-optimizer")
@login_required
def dfs_optimizer():
    return render_template("index.html")


@app.route("/dfs-optimizer/projections", methods=['GET', 'POST'])
@login_required
@cache.cached(timeout=3600)
def dfs_projections():
    global projections_dict
    projections_dict = {'mlb': get_mlb_projections(),
                        'nfl': get_nfl_projections(),
                        'nba': get_nba_projections()}
    return jsonify(projections_dict)


@app.route("/optimized-lineup/<sport>", methods=['GET', 'POST'])
@login_required
def optimized_team(sport):
    global projections, fd_black_list, dk_black_list
    try:
        projections = projections_dict.get(sport)
    except NameError:
        pass
    if request.method == 'POST':
        data = request.get_data()
        data_tuple = tuple(str(data)[2:-1].split('|'))
        removed_player, site = data_tuple[0], data_tuple[1]
        if site == 'fd' and removed_player not in fd_black_list:
            fd_black_list.append(removed_player)
        elif site == 'dk' and removed_player not in dk_black_list:
            dk_black_list.append(removed_player)
    else:
        fd_black_list = []
        dk_black_list = []
    dfs_lineups = get_dfs_lineups(sport, projections, fd_black_list, dk_black_list)
    return jsonify(dfs_lineups)


if __name__ == "__main__":
    app.run()
