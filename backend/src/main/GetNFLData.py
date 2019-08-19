from backend.src.main.DFSFunctions import *
import datetime


def get_sunday_string():
    now = datetime.datetime.now()
    current_day = datetime.datetime.today().weekday()
    days_till_sunday = 6 - current_day
    sunday = now + datetime.timedelta(days=days_till_sunday)
    sunday_string = str(sunday.year) + '-' + str(sunday.month) + '-' + str(sunday.day)
    return sunday_string


def get_current_week(sunday_string):
    events_endpoint = 'stats/football/nfl/events/'
    events_call = call_api(events_endpoint, '&date=' + str(sunday_string))
    if events_call == '404 error':
        return 'no games'
    events = events_call.get('apiResults')[0].get('league').get('season').get('eventType')[0].get('events')
    week = events[0].get('week')
    return week


def get_events(week):
    events_endpoint = 'stats/football/nfl/events/'
    events_call = call_api(events_endpoint, '&week=' + str(week))
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


def get_projections(week):
    projections_endpoint = 'stats/football/nfl/fantasyProjections/weekly/'
    proj_responses = call_api(projections_endpoint + str(week), '&season=2018').get('apiResults')[0].get('league').get(
            'season').get('eventType')[0].get('fantasyProjections')
    return proj_responses


def get_offense_projections(projections):
    offense_list = projections.get('offensiveProjections')
    offense_projections = {
        player.get('player').get('firstName') + ' ' + player.get('player').get('lastName'):
        {
            'team': player.get('team').get('abbreviation'),
            'projection': player.get('fantasyProjections')
        }
        for player in offense_list if player.get('position') != 'K'
    }
    return offense_projections


def get_defense_projections(projections):
    defense_list = projections.get('defensiveProjections')
    defense_projections = {
        team.get('team').get('nickname') + ' D/ST':
        {
            'team': team.get('team').get('abbreviation'),
            'projection': team.get('fantasyProjections')
        }
        for team in defense_list
    }
    return defense_projections


def get_projections_from_week(week):
    projections_data = get_projections(week)
    projections_from_week = {}
    projections_from_week.update(get_offense_projections(projections_data))
    projections_from_week.update(get_defense_projections(projections_data))
    return projections_from_week


def get_weather(date_string):
    weather_endpoint = 'stats/football/nfl/weatherforecasts/'
    call = call_api(weather_endpoint, '&date=' + date_string)
    weather_results_by_event = call.get('apiResults')[0].get('league').get('season').get('eventType')[0].get('weatherForecasts')
    weather_by_event = {forecast.get('eventId'):
                        {'forecast': forecast.get('forecasts')[0].get('condition'),
                         'details':
                            str(int(forecast.get('forecasts')[0].get('temperature')[0].get('degrees'))) + '°, ' +
                            str(int(round(float(forecast.get('forecasts')[0].get('precipitation')) * 100, 0))) + '% precip'}
                        for forecast in weather_results_by_event}
    return weather_by_event


def get_nfl_projections():
    try:
        if is_offseason('nfl'):
            return 'offseason'
        sunday_string = get_sunday_string()
        week = get_current_week(sunday_string)
        events = get_events(week)
        team_info = get_team_info(events)
        projections = get_projections_from_week(week)
        weather_by_event = get_weather(sunday_string)
        nfl_projections = [{
            'name': player,
            'projection': projection or 'unavailable',
            'team': player.get('team') or 'unavailable',
            'opponent': team_info.get(player.get('team')).get('opponent') or 'unavailable',
            'weather': weather_by_event.get(
                team_info.get(player.get('team')).get('eventId')) or 'unavailable'
        } for player, projection in projections.items()]
        return nfl_projections
    except ConnectionError:
        return 'Error obtaining projection data.'
