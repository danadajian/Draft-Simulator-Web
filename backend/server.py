from src.main.GetESPNPlayers import get_espn_players
from src.main.GetYahooPlayers import get_yahoo_players
from src.main.GetMLBData import get_mlb_projections
from src.main.GetNBAData import get_nba_projections
from src.main.GetNFLData import get_nfl_projections
from src.main.Optimizer import *
from src.main.Simulator import *
from flask import *
from flask_bootstrap import Bootstrap
from flask_caching import Cache
from flask_heroku import Heroku
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
import os
from sqlalchemy_utils import database_exists
from werkzeug.security import generate_password_hash, check_password_hash
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import InputRequired, Email, Length

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret123'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
heroku = Heroku(app)
bootstrap = Bootstrap(app)
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

is_production = True if os.environ.get('IS_HEROKU') else False
postgres_configured = True
if not is_production:
    try:
        database_exists('postgresql://localhost/accounts')
    except Exception as e:
        postgres_configured = False
        print(e.args, '=> WARNING: Postgres is not configured, so login functionality cannot be tested.')
        pass
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/accounts'


class Users(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(30))
    user_espn_ranking = db.Column(db.String(10000), unique=False)
    user_yahoo_ranking = db.Column(db.String(10000), unique=False)


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
    if request.method == 'GET' and request.args.get('next'):
        endpoint = request.args.get('next').split('/')[1].replace('-', '_')
        session['redirect'] = endpoint
    error = 'Incorrect username or password.' if request.form.get('username') and request.form.get('password') else None
    if form.validate_on_submit():
        user = Users.query.filter_by(username=form.username.data).first()
        if user:
            if check_password_hash(user.password, form.password.data):
                login_user(user, remember=form.remember.data)
                return redirect(url_for(session.get('redirect') or 'home'))
    return render_template('login.html', form=form, error=error, endpoint=session.get('redirect') or 'home')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = RegisterForm()
    message = None
    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data, method='sha256')
        new_user = Users(username=form.username.data, email=form.email.data, password=hashed_password,
                         user_espn_ranking='No ranking specified.', user_yahoo_ranking='No ranking specified.')
        user_exists = Users.query.filter_by(username=form.username.data).first()
        email_exists = Users.query.filter_by(email=form.email.data).first()
        if user_exists:
            message = 'Username already exists.  Please try again.'
        elif email_exists:
            message = 'Email has been taken.  Please try again.'
        else:
            db.session.add(new_user)
            db.session.commit()
            message = 'Your account has been created!  Now please login.'

    return render_template('signup.html', form=form, message=message)


def might_need_to_login(login_decorator, boolean):
    def decorator(func):
        if not boolean:
            return func
        return login_decorator(func)
    return decorator


@app.route('/logout')
@might_need_to_login(login_required, is_production or postgres_configured)
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route("/home")
@might_need_to_login(login_required, is_production or postgres_configured)
def home():
    return render_template("index.html")


@app.route("/simulate")
@might_need_to_login(login_required, is_production or postgres_configured)
def simulate():
    return render_template("index.html")


@app.route("/load-ranking/<site>")
@might_need_to_login(login_required, is_production or postgres_configured)
def load_ranking(site):
    user = Users.query.filter_by(username=current_user.username).first()
    ranking = user.user_espn_ranking if site == 'espn' else user.user_yahoo_ranking
    return jsonify([ranking]) if ranking == 'No ranking specified.' else jsonify(eval(ranking))


@app.route("/save-ranking/<site>", methods=['POST'])
@might_need_to_login(login_required, is_production or postgres_configured)
def save_ranking(site):
    player_list_string = str(request.get_data())[2:-1].replace('\\', '')
    user = Users.query.filter_by(username=current_user.username).first()
    if site == 'espn':
        user.user_espn_ranking = player_list_string
    else:
        user.user_yahoo_ranking = player_list_string
    db.session.commit()
    return 'User ranking saved.'


@app.route("/cached-espn-players")
@might_need_to_login(login_required, is_production or postgres_configured)
@cache.cached(timeout=86400)
def cached_espn_players():
    return get_espn_players()


@app.route("/espn-players")
@might_need_to_login(login_required, is_production or postgres_configured)
def espn_players():
    return jsonify(cached_espn_players())


@app.route("/cached-yahoo-players")
@might_need_to_login(login_required, is_production or postgres_configured)
@cache.cached(timeout=86400)
def cached_yahoo_players():
    return get_yahoo_players()


@app.route("/yahoo-players")
@might_need_to_login(login_required, is_production or postgres_configured)
def yahoo_players():
    return jsonify(cached_yahoo_players())


@app.route("/draft-results", methods=['POST'])
@might_need_to_login(login_required, is_production or postgres_configured)
def run_draft():
    data_list = str(request.get_data())[2:-1].split('|')
    players_string, team_count, pick_order, round_count, site = data_list
    team_count, pick_order, round_count = int(team_count), int(pick_order), int(round_count)
    user_list = eval(players_string.replace('\\', ''))
    player_list = cached_espn_players() if site == 'espn' else cached_yahoo_players()
    try:
        draft_results = get_draft_results(user_list, player_list, team_count, pick_order, round_count)
    except RuntimeError:
        draft_results = ['Draft error!']
    return jsonify(draft_results)


@app.route("/optimize")
@might_need_to_login(login_required, is_production or postgres_configured)
def optimize():
    return render_template("index.html")


@app.route("/optimize/projections/<sport>")
@might_need_to_login(login_required, is_production or postgres_configured)
@cache.cached(timeout=3600)
def cached_dfs_projections(sport):
    if sport == 'mlb':
        return get_mlb_projections()
    elif sport == 'nfl':
        return get_nfl_projections()
    elif sport == 'nba':
        return get_nba_projections()
    else:
        return 'Invalid sport.'


@app.route("/optimized-lineup/<sport>", methods=['GET', 'POST'])
@might_need_to_login(login_required, is_production or postgres_configured)
def optimized_team(sport):
    projections = cached_dfs_projections(sport)
    if request.method == 'POST':
        data = request.get_data()
        data_tuple = tuple(str(data)[2:-1].split('|'))
        removed_player, site = data_tuple[0], data_tuple[1]
        fd_black_list, dk_black_list = session.get('fd_black_list'), session.get('dk_black_list')
        if site == 'fd' and removed_player not in fd_black_list:
            fd_black_list.append(removed_player)
        elif site == 'dk' and removed_player not in dk_black_list:
            dk_black_list.append(removed_player)
    else:
        fd_black_list, dk_black_list = [], []
    session['fd_black_list'], session['dk_black_list'] = fd_black_list, dk_black_list
    dfs_lineups = get_dfs_lineups(sport, projections, fd_black_list, dk_black_list)
    return jsonify(dfs_lineups)


if __name__ == "__main__":
    app.run()
