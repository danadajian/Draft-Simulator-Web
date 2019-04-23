from src.main.GetPlayers import get_players
from src.main.SimulateDraft import *
from src.main.MLBSalaries import mlbSalaryDict, mlbPointsDict, mlbPositionsDict
from src.main.NBASalaries import nbaSalaryDict, nbaPointsDict, nbaPositionsDict
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


@app.route("/optimized-lineup/<sport>")
def optimized_team(sport):
    if sport == 'mlb':
        fd_lineup_matrix = ['P', 'C 1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF', 'C 1B 2B 3B SS OF']
        fd_display_matrix = ['P', 'C/1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF', 'Util']
        dk_lineup_matrix = ['P', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF']
        return output_lineups(fd_lineup_matrix, fd_display_matrix, dk_lineup_matrix, dk_lineup_matrix, mlbPointsDict,
                              mlbPositionsDict, mlbSalaryDict, 35000, 50000)
    elif sport == 'nba':
        fd_lineup_matrix = ['PG', 'PG', 'SG', 'SG', 'SF', 'SF', 'PF', 'PF', 'C']
        dk_lineup_matrix = ['PG', 'SG', 'SF', 'PF', 'C', 'PG SG', 'SF PF', 'PG SG SF PF C']
        dk_display_matrix = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'Util']
        return output_lineups(fd_lineup_matrix, fd_lineup_matrix, dk_lineup_matrix, dk_display_matrix, nbaPointsDict,
                              nbaPositionsDict, nbaSalaryDict, 60000, 50000)
    else:
        return 'Sport not yet selected.'


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
