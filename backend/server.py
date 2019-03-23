from src.main.GetPlayers import get_players
import os
import flask

app = flask.Flask("__name__")


@app.route("/")
def index():
    return flask.render_template("index.html")


@app.route("/players")
def hello():
    return get_players()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
