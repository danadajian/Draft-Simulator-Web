import hashlib
import requests
import time
import datetime
import os
try:
    from backend.src.main.apiCredentials import *
except ImportError:
    print()

is_production = os.environ.get('IS_HEROKU', None)
if is_production:
    api_key = os.environ.get('API_KEY')
    api_secret = os.environ.get('API_SECRET')
else:
    api_key = api_key_from_credentials
    api_secret = api_secret_from_credentials

timestamp = repr(int(time.time()))
encoded_string = str.encode(api_key + api_secret + timestamp)
signature = hashlib.sha256(encoded_string).hexdigest()
now = datetime.datetime.now()
dateString = str(now.year) + '-' + str(now.month) + '-' + str(now.day)


def call_api(endpoint, extra_params):
    params = 'accept=json&api_key=' + api_key + '&sig=' + signature + extra_params
    url = 'http://api.stats.com/v1/stats/' + endpoint + '?' + params
    response = requests.get(url)
    if response.status_code != 200:
        print(response.status_code)
        raise Exception
    return response.json()


def get_mlb_projections():
    events_endpoint = 'baseball/mlb/events/'
    events = call_api(events_endpoint, '&date=' + dateString).get('apiResults')[0].get('league').get('season').get('eventType')[0].get('events')
    eventids = [event.get('eventId') for event in events]

    projections_endpoint = 'baseball/mlb/fantasyProjections/'
    proj_responses = [call_api(projections_endpoint + str(eventId), '').get('apiResults')[0].get('league').get('season').get('eventType')[0].get('fantasyProjections').get('teams') for eventId in eventids]
    batter_data = [team.get('batters') if team.get('batters') else team.get('pitchers') for teamPairs in proj_responses for team in teamPairs]
    pitcher_data = [team.get('pitchers') for teamPairs in proj_responses for team in teamPairs]
    batters = [{batter.get('playerId'): batter.get('fantasyProjections')} for team in batter_data for batter in team]
    pitchers = [{pitcher.get('playerId'): pitcher.get('fantasyProjections')} for team in pitcher_data for pitcher in team if len(pitcher.get('fantasyProjections')) > 1]
    players = batters + pitchers

    participants_endpoint = 'baseball/mlb/participants/'
    participants = call_api(participants_endpoint, '&season=' + str(now.year))
    player_list = participants.get('apiResults')[0].get('league').get('seasons')[0].get('players')
    player_info = {player.get('playerId'): player.get('firstName') + ' ' + player.get('lastName') for player in player_list}

    playerid_projections = dict(zip([list(player.keys())[0] for player in players], [list(player.values())[0] for player in players]))

    mlb_projections = dict(zip([player_info.get(playerId) if player_info.get(playerId) else 'TBA' for playerId in playerid_projections.keys()], playerid_projections.values()))

    return mlb_projections


def get_nba_projections():
    return 'offseason'


# print(get_mlb_projections())