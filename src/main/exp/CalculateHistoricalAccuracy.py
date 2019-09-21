from src.main.optimizer.DFSFunctions import *


def call_weekly_projections(week, year):
    endpoint = 'stats/football/nfl/fantasyProjections/weekly/' + str(week)
    result = call_api(endpoint, '&season=' + str(year))
    projections = result.get('apiResults')[0].get('league').get('season').get('eventType')[0].get('fantasyProjections')
    return projections


def get_offense_projections(projections):
    offense_list = projections.get('offensiveProjections')
    offense_projections = {
        player.get('player').get('firstName') + ' ' + player.get('player').get('lastName'):
        {
            'dkProjections': float(player.get('fantasyProjections')[0].get('points')),
            'fdProjections': float(player.get('fantasyProjections')[1].get('points')),
            'statsPPRProjections': float(player.get('fantasyProjections')[4].get('points'))
        }
        for player in offense_list
    }
    return offense_projections


def get_defense_projections(projections):
    defense_list = projections.get('defensiveProjections')
    defense_projections = {
        team.get('team').get('nickname') + ' D/ST':
        {
            'dkProjections': float(team.get('fantasyProjections')[0].get('points')),
            'fdProjections': float(team.get('fantasyProjections')[1].get('points')),
            'statsPPRProjections': float(team.get('fantasyProjections')[4].get('points'))
        }
        for team in defense_list
    }
    return defense_projections


def get_weekly_projections(year):
    weekly_projections_dict = {}
    for weekIndex in range(16):
        week = weekIndex + 1
        this_week_projections = call_weekly_projections(week, year)
        all_projections = {}
        all_projections.update(get_offense_projections(this_week_projections))
        all_projections.update(get_defense_projections(this_week_projections))
        print('Compiling Week ' + str(week) + ' projections...')
        weekly_projections_dict.update({'Week ' + str(week): all_projections})
    return weekly_projections_dict


def get_game_data(event_id):
    events_endpoint = 'stats/football/nfl/events/' + str(event_id)
    events_call = call_api(events_endpoint, '&box=true')
    results = events_call.get('apiResults')[0].get('league').get('season').get('eventType')[0].get('events')[0]
    return results


def get_rushing_stats(data):
    rushing_stats = [team.get('playerStats').get('rushingStats') for team in data.get('boxscores')]
    player_rushing_stats = {
        playerInfo.get('player').get('firstName') + ' ' + playerInfo.get('player').get('lastName'):
            {
                'rushyds': int(playerInfo.get('yards')),
                'rushtds': int(playerInfo.get('touchdowns')),
                'rushfumblost': int(playerInfo.get('fumblesLost'))
            }
        for team in rushing_stats for playerInfo in team
    }
    return player_rushing_stats


def get_passing_stats(data):
    passing_stats = [team.get('playerStats').get('passingStats') for team in data.get('boxscores')]
    player_passing_stats = {
        playerInfo.get('player').get('firstName') + ' ' + playerInfo.get('player').get('lastName'):
            {
                'passints': int(playerInfo.get('interceptions')),
                'passyds': int(playerInfo.get('yards')),
                'passtds': int(playerInfo.get('touchdowns')),
                'passfumblost': int(playerInfo.get('fumblesLost'))
             }
        for team in passing_stats for playerInfo in team
    }
    return player_passing_stats


def get_receiving_stats(data):
    receiving_stats = [team.get('playerStats').get('receivingStats') for team in data.get('boxscores')]
    player_receiving_stats = {
        playerInfo.get('player').get('firstName') + ' ' + playerInfo.get('player').get('lastName'):
            {
                'recs': int(playerInfo.get('receptions')),
                'recyds': int(playerInfo.get('yards')),
                'rectds': int(playerInfo.get('touchdowns')),
                'recfumblost': int(playerInfo.get('fumblesLost'))
             }
        for team in receiving_stats for playerInfo in team
    }
    return player_receiving_stats


def get_kick_return_tds(data):
    kick_return_stats = [team.get('playerStats').get('kickReturnStats') for team in data.get('boxscores')]
    player_kick_return_tds = {
        playerInfo.get('player').get('firstName') + ' ' + playerInfo.get('player').get('lastName'):
            {
                'returntds': int(playerInfo.get('touchdowns'))
             }
        for team in kick_return_stats for playerInfo in team
    }
    return player_kick_return_tds


def get_punt_return_tds(data):
    punt_return_stats = [team.get('playerStats').get('puntReturnStats') for team in data.get('boxscores')]
    player_punt_return_tds = {
        playerInfo.get('player').get('firstName') + ' ' + playerInfo.get('player').get('lastName'):
            {
                'returntds': int(playerInfo.get('touchdowns'))
             }
        for team in punt_return_stats for playerInfo in team
    }
    return player_punt_return_tds


def get_two_point_conversions(data):
    two_point_stats = [team.get('playerStats').get('twoPointConversionStats') for team in data.get('boxscores')]
    if not two_point_stats:
        return {}
    player_two_point_conversions = {
        playerInfo.get('player').get('firstName') + ' ' + playerInfo.get('player').get('lastName'):
            {
                'twopoint': int(playerInfo.get('scores')) + int(playerInfo.get('passes'))
             }
        for team in two_point_stats for playerInfo in team
    }
    return player_two_point_conversions


def get_offense_stats(data):
    rushing_stats = get_rushing_stats(data)
    passing_stats = get_passing_stats(data)
    receiving_stats = get_receiving_stats(data)
    kick_return_tds = get_kick_return_tds(data)
    punt_return_tds = get_punt_return_tds(data)
    two_point = get_two_point_conversions(data)
    distinct_players = set(list(rushing_stats.keys()) + list(passing_stats.keys()) + list(receiving_stats.keys()) +
                           list(kick_return_tds.keys()) + list(punt_return_tds.keys()) + list(two_point.keys()))
    master_data_dict = {
        player:
        {
            'rushyds': rushing_stats.get(player).get('rushyds') if rushing_stats.get(player) else 0,
            'rushtds': rushing_stats.get(player).get('rushtds') if rushing_stats.get(player) else 0,
            'passyds': passing_stats.get(player).get('passyds') if passing_stats.get(player) else 0,
            'passtds': passing_stats.get(player).get('passtds') if passing_stats.get(player) else 0,
            'passints': passing_stats.get(player).get('passints') if passing_stats.get(player) else 0,
            'recyds': receiving_stats.get(player).get('recyds') if receiving_stats.get(player) else 0,
            'rectds': receiving_stats.get(player).get('rectds') if receiving_stats.get(player) else 0,
            'recs': receiving_stats.get(player).get('recs') if receiving_stats.get(player) else 0,
            'returntds': kick_return_tds.get(player).get('returntds') if kick_return_tds.get(player) else 0 +
                         punt_return_tds.get(player).get('returntds') if punt_return_tds.get(player) else 0,
            'fumblost': rushing_stats.get(player).get('rushfumblost') if rushing_stats.get(player) else 0 +
                        passing_stats.get(player).get('passfumblost') if passing_stats.get(player) else 0 +
                        receiving_stats.get(player).get('recfumblost') if receiving_stats.get(player) else 0,
            'twopoint': two_point.get(player).get('twopoint') if two_point.get(player) else 0
        }
        for player in distinct_players
    }
    return master_data_dict


def get_defense_stats(data):
    team_ids = {
        team.get('teamId'):
        team.get('nickname')
        for team in data.get('teams')
    }

    team_id_defense_stats = {
        team.get('teamId'):
        {
            'deftds': int(team.get('teamStats').get('returnTotals').get('touchdowns')),
            'ints': int(team.get('teamStats').get('interceptions').get('number')),
            'sacks': int(team.get('teamStats').get('defense').get('sacks')),
            'fumbrec': int(team.get('teamStats').get('opponentFumbles').get('recovered')),
            'blockedkicks': int(team.get('teamStats').get('extraPoints').get('blocked')) +
                            int(team.get('teamStats').get('fieldGoals').get('blocked')),
            'safeties': int(team.get('teamStats').get('safeties'))
        }
        for team in data.get('boxscores')
    }
    for team in data.get('teams'):
        team_id_defense_stats.get(team.get('teamId')).update({'ptsallowed': team.get('score')})

    team_defense_stats = dict(zip([team_ids.get(team_id) + ' D/ST' for team_id in team_id_defense_stats],
                                  team_id_defense_stats.values()))
    return team_defense_stats


def calculate_fd_offense_score(rushyds, rushtds, passyds, passtds, passints,
                               recyds, rectds, recs, returntds, fumblost, twopoint):
    score = 0.1*rushyds + 6*rushtds + 0.04*passyds + 4*passtds - 2*passints \
            + 0.1*recyds + 6*rectds + 0.5*recs + 6*returntds - 2*fumblost + 2*twopoint
    return score


def calculate_dk_offense_score(rushyds, rushtds, passyds, passtds, passints,
                               recyds, rectds, recs, returntds, fumblost, twopoint):
    score = 0.1*rushyds + 6*rushtds + 0.04*passyds + 4*passtds - passints + 0.1*recyds + 6*rectds + recs + \
            6*returntds - fumblost + 2*twopoint
    score = score + 3 if rushyds >= 100 else score
    score = score + 3 if passyds >= 300 else score
    score = score + 3 if recyds >= 100 else score
    return score


def calculate_stats_offense_score(rushyds, rushtds, passyds, passtds, passints,
                               recyds, rectds, recs, returntds, fumblost, twopoint):
    score = 0.1*rushyds + 6*rushtds + 0.04*passyds + 4*passtds - 2*passints \
            + 0.1*recyds + 6*rectds + recs + 6*returntds - 2*fumblost + 2*twopoint
    return score


def calculate_defense_score(sacks, fumbrec, deftds, safeties, blockedkicks, ints, ptsallowed):
    pts_allowed_score = 10 if ptsallowed == 0 else 7 if ptsallowed < 7 else 4 if ptsallowed < 14 else \
        1 if ptsallowed < 21 else 0 if ptsallowed < 28 else -1 if ptsallowed < 35 else -4
    score = sacks + 2*fumbrec + 6*deftds + 2*safeties + 2*blockedkicks + 2*ints + pts_allowed_score
    return score


def get_offense_scores(stats):
    offense_score_dict = {
        player:
        {
            'fd':
                round(calculate_fd_offense_score(stats.get(player).get('rushyds'), stats.get(player).get('rushtds'),
                                                 stats.get(player).get('passyds'), stats.get(player).get('passtds'),
                                                 stats.get(player).get('passints'), stats.get(player).get('recyds'),
                                                 stats.get(player).get('rectds'), stats.get(player).get('recs'),
                                                 stats.get(player).get('returntds'), stats.get(player).get('fumblost'),
                                                 stats.get(player).get('twopoint')), 1),
            'dk':
                round(calculate_dk_offense_score(stats.get(player).get('rushyds'), stats.get(player).get('rushtds'),
                                                 stats.get(player).get('passyds'), stats.get(player).get('passtds'),
                                                 stats.get(player).get('passints'), stats.get(player).get('recyds'),
                                                 stats.get(player).get('rectds'), stats.get(player).get('recs'),
                                                 stats.get(player).get('returntds'), stats.get(player).get('fumblost'),
                                                 stats.get(player).get('twopoint')), 1),
            'stats':
                round(calculate_stats_offense_score(stats.get(player).get('rushyds'), stats.get(player).get('rushtds'),
                                                    stats.get(player).get('passyds'), stats.get(player).get('passtds'),
                                                    stats.get(player).get('passints'), stats.get(player).get('recyds'),
                                                    stats.get(player).get('rectds'), stats.get(player).get('recs'),
                                                    stats.get(player).get('returntds'), stats.get(player).get('fumblost'),
                                                    stats.get(player).get('twopoint')), 1)
        }
        for player in stats.keys()
    }
    return offense_score_dict


def get_defense_scores(stats):
    defense_score_dict = {
        team:
        calculate_defense_score(stats.get(team).get('sacks'), stats.get(team).get('fumbrec'),
                                   stats.get(team).get('deftds'), stats.get(team).get('safeties'),
                                   stats.get(team).get('blockedkicks'), stats.get(team).get('ints'),
                                   stats.get(team).get('ptsallowed'))
        for team in stats.keys()
    }
    return defense_score_dict


def get_all_scores(event):
    game_data = get_game_data(event)
    offense_stats = get_offense_stats(game_data)
    defense_stats = get_defense_stats(game_data)
    all_scores = {}
    all_scores.update(get_offense_scores(offense_stats))
    all_scores.update(get_defense_scores(defense_stats))
    return all_scores


def get_weekly_events(year):
    events_endpoint = 'stats/football/nfl/events/'
    events_call = call_api(events_endpoint, '&eventTypeId=1&season=' + str(year))
    event_data_list = events_call.get('apiResults')[0].get('league').get('season').get('eventType')[0].get('events')
    events = {
        'Week %s' % str(i + 1): [event.get('eventId') for event in event_data_list if event.get('week') == i + 1]
        for i in range(16)
    }
    return events


def get_weekly_scores(year):
    events_dict = get_weekly_events(year)
    weekly_scores = {}
    for week, events in events_dict.items():
        print('Compiling ' + week + ' scores ...')
        this_week_scores = {}
        for event in events:
            this_event_scores = get_all_scores(event)
            this_week_scores.update(this_event_scores)
        weekly_scores.update({week: this_week_scores})
    return weekly_scores


def get_avg_diff_scores_to_projections(year):
    scores = get_weekly_scores(year)
    projections = get_weekly_projections(year)
    fd_diffs, dk_diffs, stats_diffs = [], [], []
    for week, players_and_scores in scores.items():
        for player, scores in players_and_scores.items():
            if projections.get(week).get(player):
                fd_diffs.append(abs(scores if player.endswith('D/ST') else scores.get('fd') -
                                    projections.get(week).get(player).get('fdProjections')))
                dk_diffs.append(abs(scores if player.endswith('D/ST') else scores.get('dk') -
                                    projections.get(week).get(player).get('dkProjections')))
                stats_diffs.append(abs(scores if player.endswith('D/ST') else scores.get('stats') -
                                       projections.get(week).get(player).get('statsPPRProjections')))
    results = {
        'fd_avg_diff': sum(fd_diffs) / len(fd_diffs),
        'dk_avg_diff': sum(dk_diffs) / len(dk_diffs),
        'stats_avg_diff': sum(stats_diffs) / len(stats_diffs)
    }
    return results


print(get_avg_diff_scores_to_projections(2018))
