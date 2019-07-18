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


def call_api(endpoint, extra_params):
    timestamp = repr(int(time.time()))
    encoded_string = str.encode(api_key + api_secret + timestamp)
    signature = hashlib.sha256(encoded_string).hexdigest()
    params = 'accept=json&api_key=' + api_key + '&sig=' + signature + extra_params
    url = 'http://api.stats.com/v1/stats/' + endpoint + '?' + params
    response = requests.get(url)
    if response.status_code == 404:
        return '404 error'
    elif response.status_code != 200:
        print(response.status_code)
        raise Exception
    return response.json()


def get_mlb_projections():
    now = datetime.datetime.now()
    date_string = str(now.year) + '-' + str(now.month) + '-' + str(now.day)
    events_endpoint = 'baseball/mlb/events/'
    events_call = call_api(events_endpoint, '&date=' + date_string)
    if events_call == '404 error':
        return 'no games'
    events = events_call.get('apiResults')[0].get('league').get('season').get('eventType')[0].get('events')
    team_pairs = [{'homeTeam': event.get('teams')[0].get('abbreviation'), 'awayTeam': event.get('teams')[1].get('abbreviation')} for event in events]
    home_teams = [team_pair.get('homeTeam') for team_pair in team_pairs]
    home_opps = [{'opponent': 'v. ' + team_pair.get('awayTeam'), 'eventId': events[team_pairs.index(team_pair)].get('eventId')} for team_pair in team_pairs]
    home_teams_info = dict(zip(home_teams, home_opps))
    away_teams = [team_pair.get('awayTeam') for team_pair in team_pairs]
    away_opps = [{'opponent': '@ ' + team_pair.get('homeTeam'), 'eventId': events[team_pairs.index(team_pair)].get('eventId')} for team_pair in team_pairs]
    away_teams_info = dict(zip(away_teams, away_opps))
    team_info = dict(home_teams_info)
    team_info.update(away_teams_info)
    print(team_info)

    projections_endpoint = 'baseball/mlb/fantasyProjections/'
    proj_responses = [call_api(projections_endpoint + str(event.get('eventId')), '').get('apiResults')[0].get('league').get('season').get('eventType')[0].get('fantasyProjections').get('teams') for event in events]
    batter_data = [team.get('batters') if team.get('batters') else team.get('pitchers') for teamPairs in proj_responses for team in teamPairs]
    pitcher_data = [team.get('pitchers') for teamPairs in proj_responses for team in teamPairs]
    batters = [{batter.get('playerId'): batter.get('fantasyProjections')} for team in batter_data for batter in team]
    pitchers = [{pitcher.get('playerId'): pitcher.get('fantasyProjections')} for team in pitcher_data for pitcher in team if len(pitcher.get('fantasyProjections')) > 1]
    players = batters + pitchers
    player_ids = [list(player.keys())[0] for player in players]

    weather_endpoint = 'baseball/mlb/weatherforecasts/'
    call = call_api(weather_endpoint, '&date=' + date_string)
    weather_results_by_event = call.get('apiResults')[0].get('league').get('season').get('eventType')[0].get('weatherForecasts')
    weather_by_event = {forecast.get('eventId'):
                       str(int(forecast.get('forecasts')[0].get('temperature')[0].get('degrees'))) + '°, ' +
                       forecast.get('forecasts')[0].get('condition') + ', ' +
                       str(int(round(float(forecast.get('forecasts')[0].get('precipitation')) * 100, 0))) + '% precip'
                       for forecast in weather_results_by_event}

    participants_endpoint = 'baseball/mlb/participants/'
    participants = call_api(participants_endpoint, '&season=' + str(now.year))
    player_list = participants.get('apiResults')[0].get('league').get('seasons')[0].get('players')
    player_info = []
    for player in player_list:
        if player.get('playerId') in player_ids:
            player_id = player.get('playerId')
            name = player.get('firstName') + ' ' + player.get('lastName')
            team = player.get('team').get('abbreviation')
            print(player_id, name, team)
            opponent = team_info.get(team).get('opponent')
            weather = weather_by_event.get(team_info.get(team).get('eventId'))
            if not opponent or not weather:
                print(player_id, name, team)
            info = {'playerId': player_id,
                        'name': name,
                        'team': team,
                        'opponent': opponent,
                        'weather': weather}
            player_info.append(info)
    print(player_info)

    return
    player_projections_and_info = [list(player.values())[0] for player in players]
    playerid_projections = dict(zip([list(player.keys())[0] for player in players], player_projections_and_info))
    available_players = [player_info.get(playerId) for playerId in playerid_projections.keys() if player_info.get(playerId)]
    mlb_projections = dict(zip(available_players, playerid_projections.values()))
    print(mlb_projections)
    return mlb_projections


def get_nba_projections():
    return 'offseason'


def get_nfl_projections():
    return 'offseason'


print(get_mlb_projections())
