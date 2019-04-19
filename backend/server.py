from src.main.GetPlayers import get_players
from src.main.SimulateDraft import *
from src.main.MLBSalaries import dfsSalaryDict, dfsPointsDict, dfsPositionsDict
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


@app.route("/optimized-lineup")
def optimized_team():
    fd_lineup_matrix = ['P', 'C 1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF', 'C 1B 2B 3B SS OF']
    fd_display_matrix = ['P', 'C/1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF', 'Util']
    dk_lineup_matrix = ['P', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF']
    fd_proj_dict = dfsPointsDict.get('Fanduel')
    dk_proj_dict = dfsPointsDict.get('Draftkings')
    fd_pos_dict = dfsPositionsDict.get('Fanduel')
    dk_pos_dict = dfsPositionsDict.get('Draftkings')
    fd_salary_dict = dfsSalaryDict.get('Fanduel')
    dk_salary_dict = dfsSalaryDict.get('Draftkings')
    fd_cap = 35000
    dk_cap = 50000
    fd_list = best_lineup(fd_lineup_matrix, fd_proj_dict, fd_pos_dict)
    fd_best_lineup, fd_pools, fd_proj_dict = fd_list[0], fd_list[1], fd_list[2]
    fd_optimal_lineup = optimize(fd_best_lineup, fd_pools, fd_proj_dict, fd_salary_dict, fd_cap)
    fd_total_pts = sum([fd_proj_dict.get(player) for player in fd_optimal_lineup])
    fd_total_salary = sum([fd_salary_dict.get(player) for player in fd_optimal_lineup])
    fd_max = sum([fd_proj_dict.get(player) for player in fd_best_lineup])
    dk_list = best_lineup(dk_lineup_matrix, dk_proj_dict, dk_pos_dict)
    dk_best_lineup, dk_pools, dk_proj_dict = dk_list[0], dk_list[1], dk_list[2]
    dk_optimal_lineup = optimize(dk_best_lineup, dk_pools, dk_proj_dict, dk_salary_dict, dk_cap)
    dk_total_pts = sum([dk_proj_dict.get(player) for player in dk_optimal_lineup])
    dk_total_salary = sum([dk_salary_dict.get(player) for player in dk_optimal_lineup])
    dk_max = sum([dk_proj_dict.get(player) for player in dk_best_lineup])
    fd_data = make_data_nice(fd_display_matrix, fd_optimal_lineup, fd_proj_dict, fd_salary_dict, fd_total_pts,
                             fd_total_salary, fd_max)
    dk_data = make_data_nice(dk_lineup_matrix, dk_optimal_lineup, dk_proj_dict, dk_salary_dict, dk_total_pts,
                             dk_total_salary, dk_max)
    return fd_data + '|' + dk_data


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
