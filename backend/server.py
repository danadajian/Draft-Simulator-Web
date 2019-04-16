from src.main.GetPlayers import get_players
from src.main.SimulateDraft import *
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
