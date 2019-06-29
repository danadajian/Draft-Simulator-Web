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

host = 'http://api.stats.com/v1/stats/'


def call_api(endpoint):
    params = '?accept=json&api_key=' + api_key + '&sig=' + signature
    response = requests.get(host + endpoint + params).json()
    return response


eventsEndpoint = 'baseball/mlb/events/?date=' + dateString

events = call_api(eventsEndpoint).get('apiResults')[0].get('league').get('season').get('eventType')[0].get('events')

eventIds = [event.get('eventId') for event in events]

print(eventIds)

projectionsEndpoint = 'baseball/mlb/fantasyProjections/'
projResponses = [call_api(projectionsEndpoint + str(eventId)).get('apiResults')[0].get('league').get('season').get('eventType')[0].get('fantasyProjections').get('teams') for eventId in eventIds]
teams = [team.get('teamId') for teamPairs in projResponses for team in teamPairs]
batterData = [team.get('batters') for teamPairs in projResponses for team in teamPairs]
pitcherData = [team.get('pitchers') for teamPairs in projResponses for team in teamPairs]
batters = [{batter.get('playerId'): batter.get('fantasyProjections')} for team in batterData for batter in team]
pitchers = [{pitcher.get('playerId'): pitcher.get('fantasyProjections')} for team in pitcherData for pitcher in team]
players = batters + pitchers

projEndpoint = 'baseball/mlb/participants/teams/'
teamLists = [call_api(projEndpoint + str(teamId)).get('apiResults')[0].get('league').get('players') for teamId in teams]
playerNames = {player.get('playerId'): player.get('firstName') + ' ' + player.get('lastName')
               for teamList in teamLists for player in teamList}
print(playerNames)

playerIdProjections = dict(zip([list(player.keys())[0] for player in players], [list(player.values())[0] for player in players]))

playerProjections = dict(zip([playerNames.get(id) for id in playerIdProjections.keys()], playerIdProjections.values()))

print(playerProjections)
