from src.main.GetPlayers import get_players
from src.main.SimulateDraft import *
from src.main.MLBSalaries import *
from src.main.NBASalaries import *
from src.main.Optimizer import *
import os
import flask

app = flask.Flask("__name__")


@app.route("/")
def home():
    return flask.render_template("index.html")


@app.route("/espn")
def espn():
    return flask.render_template("index.html")


@app.route("/yahoo")
def yahoo():
    return flask.render_template("index.html")


@app.route("/dfs-optimizer")
def dfs_optimizer():
    return flask.render_template("index.html")


@app.route("/optimized-lineup/<sport>", methods=['GET', 'POST'])
def optimized_team(sport):
    global ignored_players
    global site
    if flask.request.method == 'POST':
        data = flask.request.get_data()
        clean = str(data)[2:-1]
        ignored_players = tuple(clean.split('|'))
        print(ignored_players)
        if ignored_players[2] == 'fd':
            site = 'fd'
        elif ignored_players[2] == 'dk':
            site = 'dk'
        return ignored_players[:2]
    else:
        try:
            ignored_player = ignored_players[0]
            black_list = ignored_players[1].split(',') if ',' in ignored_players[1] else [ignored_players[1]]
        except NameError:
            ignored_player = ''
            black_list = []
            fd = get_fd_lineup(sport, ignored_player, black_list)
            dk = get_dk_lineup(sport, ignored_player, black_list)
            return fd + '|' + dk
        if site == 'fd':
            return get_fd_lineup(sport, ignored_player, black_list)
        elif site == 'dk':
            return get_dk_lineup(sport, ignored_player, black_list)


@app.route("/espn-players")
def espn_players():
    return get_players()


@app.route("/yahoo-players")
def yahoo_players():
    return


@app.route("/draft-results", methods=['GET', 'POST'])
def run_draft():
    global draft_results
    if flask.request.method == 'POST':
        draft_results = None
        data = flask.request.get_data()
        clean = str(data)[2:-1]
        data_list = clean.split('|')
        players_string = data_list[0]
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
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
