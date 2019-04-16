from src.main.GetPlayers import get_players
from src.main.SimulateDraft import *
from src.main.MLBSalaries import dfsSalaryDict, dfsPointsDict, dfsPositionsDict
from src.main.Optimizer import optimize
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


@app.route("/optimized-lineup")
def optimized_team():
    fd_lineup_matrix = ['P', 'C 1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF', 'C 1B 2B 3B SS OF']
    dk_lineup_matrix = ['P', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF']
    fd_proj_dict = dfsPointsDict.get('Fanduel')
    dk_proj_dict = dfsPointsDict.get('Draftkings')
    fd_pos_dict = dfsPositionsDict.get('Fanduel')
    dk_pos_dict = dfsPositionsDict.get('Draftkings')
    fd_salary_dict = dfsSalaryDict.get('Fanduel')
    dk_salary_dict = dfsSalaryDict.get('Draftkings')
    fd_cap = 35000
    dk_cap = 50000
    fd_lineup = optimize(fd_lineup_matrix, fd_proj_dict, fd_pos_dict, fd_salary_dict, fd_cap)
    dk_lineup = optimize(dk_lineup_matrix, dk_proj_dict, dk_pos_dict, dk_salary_dict, dk_cap)
    return fd_lineup + '|' + dk_lineup


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
