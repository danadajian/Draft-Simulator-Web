from src.main.GetPlayers import get_players
from src.main.SimulateDraft import *
import os
import flask
import requests

app = flask.Flask("__name__")


@app.route("/")
def index():
    return flask.render_template("index.html")


@app.route("/players")
def players():
    return get_players()


@app.route("/draft-results", methods=['GET', 'POST'])
def run_draft():
    global draft_results
    if flask.request.method == 'POST':
        draft_results = None
        data = flask.request.get_data()
        clean = str(data)[2:-1]
        replace_list = ['(QB)', '(RB)', '(WR)', '(TE)', '(K)', '(DST)', '    ']
        for item in replace_list:
            clean = clean.replace(item, '')
        user_list = clean.split(',')
        draft_results = str(simulate_draft(user_list, 10, 1, 16, 1))
        print(draft_results)
        return draft_results
    else:
        try:
            return draft_results
        except NameError:
            return 'Draft results to appear here!'


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
