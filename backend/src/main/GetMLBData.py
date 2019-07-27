from .DFSFunctions import *
import datetime


def get_events(date_string):
    events_endpoint = 'stats/baseball/mlb/events/'
    events_call = call_api(events_endpoint, '&date=' + date_string)
    if events_call == '404 error':
        return 'no games'
    events = events_call.get('apiResults')[0].get('league').get('season').get('eventType')[0].get('events')
    return events


def get_team_info(events):
    team_pairs = [
        {'homeTeam': event.get('teams')[0].get('abbreviation'), 'awayTeam': event.get('teams')[1].get('abbreviation')}
        for event in events]
    home_teams = [team_pair.get('homeTeam') for team_pair in team_pairs]
    home_opps = [
        {'opponent': 'v. ' + team_pair.get('awayTeam'), 'eventId': events[team_pairs.index(team_pair)].get('eventId')}
        for team_pair in team_pairs]
    home_teams_info = dict(zip(home_teams, home_opps))
    away_teams = [team_pair.get('awayTeam') for team_pair in team_pairs]
    away_opps = [
        {'opponent': '@ ' + team_pair.get('homeTeam'), 'eventId': events[team_pairs.index(team_pair)].get('eventId')}
        for team_pair in team_pairs]
    away_teams_info = dict(zip(away_teams, away_opps))
    team_info = dict(home_teams_info)
    team_info.update(away_teams_info)
    return team_info


def get_projections(events):
    projections_endpoint = 'stats/baseball/mlb/fantasyProjections/'
    proj_responses = [
        call_api(projections_endpoint + str(event.get('eventId')), '').get('apiResults')[0].get('league').get(
            'season').get('eventType')[0].get('fantasyProjections').get('teams') for event in events]
    batter_data = [team.get('batters') if team.get('batters') else team.get('pitchers') for teamPairs in proj_responses
                   for team in teamPairs]
    pitcher_data = [team.get('pitchers') for teamPairs in proj_responses for team in teamPairs]
    batters = [{batter.get('playerId'): batter.get('fantasyProjections')} for team in batter_data for batter in team]
    pitchers = [{pitcher.get('playerId'): pitcher.get('fantasyProjections')} for team in pitcher_data for pitcher in
                team if len(pitcher.get('fantasyProjections')) > 1]
    players = batters + pitchers
    return players


def get_weather(date_string):
    weather_endpoint = 'stats/baseball/mlb/weatherforecasts/'
    call = call_api(weather_endpoint, '&date=' + date_string)
    weather_results_by_event = call.get('apiResults')[0].get('league').get('season').get('eventType')[0].get('weatherForecasts')
    weather_by_event = {forecast.get('eventId'):
                        {'forecast': forecast.get('forecasts')[0].get('condition'),
                         'details':
                            str(int(forecast.get('forecasts')[0].get('temperature')[0].get('degrees'))) + '°, ' +
                            str(int(round(float(forecast.get('forecasts')[0].get('precipitation')) * 100, 0))) + '% precip'}
                        for forecast in weather_results_by_event}
    return weather_by_event


def get_players(team_info, player_ids):
    participants_endpoint = 'stats/baseball/mlb/participants/'
    participants = call_api(participants_endpoint, '')
    player_list = participants.get('apiResults')[0].get('league').get('players')
    final_player_list = [player for player in player_list if player.get('playerId') in player_ids
                         and player.get('team').get('abbreviation') in team_info.keys()]
    return final_player_list


def get_mlb_projections():
    try:
        if is_offseason('mlb'):
            return 'offseason'
        now = datetime.datetime.now()
        date_string = str(now.year) + '-' + str(now.month) + '-' + str(now.day)
        events = get_events(date_string)
        team_info = get_team_info(events)
        players = get_projections(events)
        playerid_projections = dict(zip([list(player.keys())[0] for player in players], [list(player.values())[0] for player in players]))
        player_ids = [list(player.keys())[0] for player in players]
        final_player_list = get_players(team_info, player_ids)
        weather_by_event = get_weather(date_string)
        mlb_projections = [{
            'name': player.get('firstName') + ' ' + player.get('lastName'),
            'projection': playerid_projections.get(player.get('playerId')),
            'team': player.get('team').get('abbreviation'),
            'opponent': team_info.get(player.get('team').get('abbreviation')).get('opponent'),
            'weather': weather_by_event.get(team_info.get(player.get('team').get('abbreviation')).get('eventId'))
        } for player in final_player_list]
        return mlb_projections
    except ConnectionError:
        return 'Error obtaining projection data.'
