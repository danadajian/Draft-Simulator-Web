from backend.src.main.DraftSimulatorWeb import *
import flask

app = flask.Flask("__main__")


@app.route("/")
def index():
    return flask.render_template("index.html")


@app.route("/players")
def hello():
    return get_players()


app.run()
