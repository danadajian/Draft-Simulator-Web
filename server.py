from src.main.simulator.GetESPNPlayers import get_espn_players
from src.main.simulator.GetYahooPlayers import get_yahoo_players
from src.main.optimizer.GetMLBData import get_mlb_projections
from src.main.optimizer.GetNBAData import get_nba_projections
from src.main.optimizer.GetDFSInfo import *
from src.main.optimizer.OutputLineups import *
from src.main.simulator.Simulator import *
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
        database_exists('postgresql://localhost/draftsimulator')
    except Exception as e:
        postgres_configured = False
        print('WARNING: Postgres is not configured, so login functionality cannot be tested.\n', e)
        pass
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/draftsimulator'


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


@app.route("/guest")
def guest():
    guest_user = Users(username='guest', email='guest@guest.com', password='guest',
                       user_espn_ranking='No ranking specified.', user_yahoo_ranking='No ranking specified.')
    user_exists = Users.query.filter_by(username='guest').first()
    if not user_exists:
        db.session.add(guest_user)
        db.session.commit()
    user = Users.query.filter_by(username='guest').first()
    login_user(user, remember=True)
    return redirect(url_for(session.get('redirect') or 'home'))


@app.route("/simulate")
@might_need_to_login(login_required, is_production or postgres_configured)
def simulate():
    return render_template("index.html")


@app.route("/load-ranking/<site>")
@might_need_to_login(login_required, is_production or postgres_configured)
def load_ranking(site):
    if current_user.username == 'guest':
        return jsonify(['You must be logged in to access this feature.'])
    user = Users.query.filter_by(username=current_user.username).first()
    ranking = user.user_espn_ranking if site == 'espn' else user.user_yahoo_ranking
    return jsonify([ranking]) if ranking == 'No ranking specified.' else jsonify(eval(ranking))


@app.route("/save-ranking/<site>", methods=['POST'])
@might_need_to_login(login_required, is_production or postgres_configured)
def save_ranking(site):
    if current_user.username == 'guest':
        return jsonify(['You must be logged in to access this feature.'])
    player_list_string = str(request.get_data())[2:-1].replace('\\', '')
    user = Users.query.filter_by(username=current_user.username).first()
    if site == 'espn':
        user.user_espn_ranking = player_list_string
    else:
        user.user_yahoo_ranking = player_list_string
    db.session.commit()
    return jsonify(['User ranking saved.'])


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


@app.route("/optimize/data/<sport>/<slate>")
@might_need_to_login(login_required, is_production or postgres_configured)
@cache.cached(timeout=3600)
def cached_dfs_data(sport, slate):
    if sport == 'mlb':
        return {'projections': get_mlb_projections(), 'info': {'fd': {}, 'dk': {}}}
    elif sport == 'nfl':
        projections = get_nfl_projections(slate)
        date_string = get_date_string('Thurs', 0)
        if slate == 'thurs':
            contest_player = next(player_dict for player_dict in projections if '@' in player_dict.get('opponent'))
            fd_contest = (contest_player.get('team') + ' ' + contest_player.get('opponent')).upper()
            dk_contest = fd_contest.replace('@', 'vs').replace('JAX', 'JAC')
            dk_game_type = 'Showdown Captain Mode'
        else:
            fd_contest, dk_contest, dk_game_type = 'Thu-Mon', 'Thu-Mon', 'Classic'
        info = {'fd': get_fd_info(fd_contest, date_string), 'dk': get_dk_info(dk_contest, dk_game_type)}
        return {'projections': projections, 'info': info}
    elif sport == 'nba':
        return {'projections': get_nba_projections(), 'info': {'fd': {}, 'dk': {}}}
    else:
        return 'Invalid sport.'


@app.route("/optimize/reporting/<sport>/<site>/<slate>", methods=['POST'])
@might_need_to_login(login_required, is_production or postgres_configured)
def save_lineups(sport, site, slate):
    data = request.get_data()
    weeks = str(data)[2:-1]
    aggregate_historical_data(sport, site, slate, db)
    query_results = get_query_results(sport, slate, site, weeks, db)
    return jsonify(aggregate_reporting_data(query_results, slate))


@app.route("/optimize/clear/<sport>/<site>/<slate>")
@might_need_to_login(login_required, is_production or postgres_configured)
def clear_lineup(sport, site, slate):
    dfs_data = cached_dfs_data(sport, slate)
    master_list = aggregate_player_info(sport, site, dfs_data.get('projections'), dfs_data.get('info').get(site)).get('master_dict')
    white_list, black_list = [], []
    session['white_list'], session['black_list'] = white_list, black_list
    configs = get_dfs_configs(sport, site, slate)
    data_dict = {'playerPool': master_list, 'lineup': configs.get('empty_lineup'), 'cap': configs.get('salary_cap')}
    return jsonify(data_dict)


@app.route("/optimize/generate/<sport>/<site>/<slate>", methods=['POST'])
@might_need_to_login(login_required, is_production or postgres_configured)
def generate_lineup(sport, site, slate):
    dfs_data = cached_dfs_data(sport, slate)
    projections, dfs_info = dfs_data.get('projections'), dfs_data.get('info').get(site)
    data = request.get_data()
    data_tuple = tuple(str(data)[2:-1].split('|'))
    white_list, black_list = data_tuple[0].split(',') if data_tuple[0] else [], data_tuple[1].split(',') if data_tuple[1] else []
    session['white_list'], session['black_list'] = white_list, black_list
    dfs_lineup = get_dfs_lineup(sport, site, slate, projections, dfs_info, white_list, black_list,
                                db if is_production or postgres_configured else None)
    return jsonify(dfs_lineup)


if __name__ == "__main__":
    app.run()
