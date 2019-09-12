from .DFSFunctions import *
import datetime


def get_dow_string(dow_number):
    now = datetime.datetime.now()
    current_day = datetime.datetime.today().weekday()
    days_till = dow_number - current_day
    dow = now + datetime.timedelta(days=days_till)
    month = '0' + str(dow.month) if len(str(dow.month)) == 1 else str(dow.month)
    day = '0' + str(dow.day) if len(str(dow.day)) == 1 else str(dow.day)
    dow_string = str(dow.year) + '-' + month + '-' + day
    return dow_string


def get_date_string(day):
    days_of_week = ['Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun', 'Mon']
    dow_dict = {day: num for num, day in enumerate(days_of_week, 1)}
    return get_dow_string(dow_dict.get(day))


def get_all_events():
    events_endpoint = 'stats/football/nfl/events/'
    events_call = call_api(events_endpoint, '')
    events = events_call.get('apiResults')[0].get('league').get('season').get('eventType')[0].get('events')
    return events


def get_event_dates(events):
    event_dates = {}
    for event in events:
        year = str(event.get('startDate')[0].get('year'))
        month = str(event.get('startDate')[0].get('month'))
        day = str(event.get('startDate')[0].get('date'))
        date_string = year + '-' + ('0' + month if len(month) == 1 else month) + '-' + ('0' + day if len(day) == 1 else day)
        event_dates.update({event.get('eventId'): date_string})
    return event_dates


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
    projections_endpoint = 'stats/football/nfl/fantasyProjections/weekly/' + str(week)
    proj_responses = call_api(projections_endpoint, '').get('apiResults')[0].get('league').get(
            'season').get('eventType')[0].get('fantasyProjections')
    return proj_responses


def get_offense_projections(projections, slate):
    offense_list = projections.get('offensiveProjections')
    offense_projections = {
        player.get('player').get('firstName') + ' ' + player.get('player').get('lastName'):
        {
            'id': player.get('player').get('playerId'),
            'team': player.get('team').get('abbreviation'),
            'projection': player.get('fantasyProjections')
        }
        for player in offense_list if slate == 'thurs' or player.get('position') != 'K'
    }
    return offense_projections


def get_defense_projections(projections):
    defense_list = projections.get('defensiveProjections')
    defense_projections = {
        team.get('team').get('nickname') + ' D/ST':
        {
            'id': team.get('team').get('teamId'),
            'team': team.get('team').get('abbreviation'),
            'projection': team.get('fantasyProjections')
        }
        for team in defense_list
    }
    return defense_projections


def get_projections_from_week(week, slate):
    projections_data = get_projections(week)
    projections_from_week = {}
    projections_from_week.update(get_offense_projections(projections_data, slate))
    projections_from_week.update(get_defense_projections(projections_data))
    return projections_from_week


def get_weather(date_strings):
    weather_endpoint = 'stats/football/nfl/weatherforecasts/'
    weather_by_event = {}
    for date_string in date_strings:
        try:
            call = call_api(weather_endpoint, '&date=' + date_string)
            weather_results_by_event = call.get('apiResults')[0].get('league').get('season').get('eventType')[0].get('weatherForecasts')
            weather_by_event.update({forecast.get('eventId'):
                                {'forecast': forecast.get('forecasts')[0].get('condition'),
                                 'details':
                                    str(int(forecast.get('forecasts')[0].get('temperature')[0].get('degrees'))) + '°, ' +
                                    str(int(round(float(forecast.get('forecasts')[0].get('precipitation')) * 100, 0))) + '% precip'}
                                for forecast in weather_results_by_event if forecast.get('forecasts')[0]})
        except FileNotFoundError:
            weather_by_event.update({})
    return weather_by_event


def get_nfl_projections(slate):
    try:
        if is_offseason('nfl'):
            return 'offseason'
        all_events = get_all_events()
        event_dates = get_event_dates(all_events)
        thurs_string, sun_string, mon_string = get_date_string('Thurs'), get_date_string('Sun'), get_date_string('Mon')
        if slate == 'main':
            events = [event for event in all_events if event_dates.get(event.get('eventId')) == sun_string][:-1]
            weather_by_event = get_weather([sun_string])
        elif slate == 'thurs':
            events = [event for event in all_events if event_dates.get(event.get('eventId')) == thurs_string]
            weather_by_event = get_weather([thurs_string])
        elif slate == 'thurs-mon':
            events = all_events
            weather_by_event = get_weather([thurs_string, sun_string, mon_string])
        elif slate == 'sun-mon':
            events = [event for event in all_events if event_dates.get(event.get('eventId')) in (sun_string, mon_string)]
            weather_by_event = get_weather([sun_string, mon_string])
        else:
            events, weather_by_event = [], []
        team_info = get_team_info(events)
        week = all_events[0].get('week')
        projections = get_projections_from_week(week, slate)
        nfl_projections = [{
            'name': player,
            'id': projection.get('id') or 'unavailable',
            'projection': projection.get('projection') or 'unavailable',
            'team': projection.get('team') or 'unavailable',
            'opponent': (team_info.get(projection.get('team')).get('opponent')
                         if team_info.get(projection.get('team')) else 'unavailable') or 'unavailable',
            'weather': (weather_by_event.get(team_info.get(projection.get('team')).get('eventId'))
                        if team_info.get(projection.get('team')) else 'unavailable') or 'unavailable'
        } for player, projection in projections.items() if team_info.get(projection.get('team'))]
        return nfl_projections
    except FileNotFoundError:
        return 'Not enough data is available.'
    except ConnectionError:
        return 'Error obtaining projection data.'
