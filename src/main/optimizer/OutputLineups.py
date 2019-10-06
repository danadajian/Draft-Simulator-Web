from .GetInjuries import *
from .TrackLineups import *
from src.main.optimizer.DfsConfigs import *


def output_lineup(lineup_matrix, display_matrix, sport, site, slate, white_list, black_list, proj_dict, pos_dict,
                  salary_dict, cap, team_and_weather_dict, injury_dict, db):
    if slate == 'thurs':
        optimal_dict = optimize_mvp(site, black_list, proj_dict, salary_dict, len(display_matrix), cap)
    else:
        optimal_dict = optimize(lineup_matrix, white_list, black_list, proj_dict, pos_dict, salary_dict, cap)
    if not optimal_dict.get('lineup'):
        return 'Warning: \nUnable to generate lineup with available data.'
    projected_lineup = optimal_dict.get('lineup')
    total_pts = round(optimal_dict.get('total_pts'), 1)
    total_salary = round(optimal_dict.get('total_salary'))
    max_pts = optimal_dict.get('max_pts')
    if sport == 'nfl' and not white_list and not black_list:
        ingest_actual_optimal_data(lineup_matrix, display_matrix, sport, site, slate, proj_dict, pos_dict, salary_dict,
                                   cap, projected_lineup, db)
    lineup_json = [
        {'Position': display_matrix[projected_lineup.index(player)],
         'Team': team_and_weather_dict.get(player).get('team') or 'unavailable',
         'Name': player,
         'Status': injury_dict.get(player) or '',
         'Projected': round(proj_dict.get(player), 1),
         'Price': round(salary_dict.get(player) *
                        (1.5 if projected_lineup.index(player) == 0 else 1))
         if slate == 'thurs' and site == 'dk' else salary_dict.get(player),
         'Opp': team_and_weather_dict.get(player).get('opponent') or 'unavailable',
         'Weather': team_and_weather_dict.get(player).get('weather') or 'unavailable'
         } for player in projected_lineup
    ]
    return lineup_json


def aggregate_player_info(sport, site, projections, dfs_info):
    site_id = 1 if site == 'dk' else 2
    if sport == 'nfl':
        id_dict = {player_dict.get('name'): player_dict.get('id')
                   for player_dict in projections
                   for site_projection in player_dict.get('projection')
                   if site_projection.get('siteId') == site_id and dfs_info.get(player_dict.get('id'))}
        pos_dict = {player_dict.get('name'): dfs_info.get(player_dict.get('id')).get('position')
                    for player_dict in projections
                    for site_projection in player_dict.get('projection')
                    if site_projection.get('siteId') == site_id and dfs_info.get(player_dict.get('id'))}
        salary_dict = {player_dict.get('name'): dfs_info.get(player_dict.get('id')).get('salary')
                       for player_dict in projections
                       for site_projection in player_dict.get('projection')
                       if site_projection.get('siteId') == site_id and dfs_info.get(player_dict.get('id'))}
    else:
        id_dict = {player_dict.get('name'): player_dict.get('id')
                   for player_dict in projections
                   for site_projection in player_dict.get('projection')
                   if site_projection.get('siteId') == site_id}
        pos_dict = {player_dict.get('name'): site_projection.get('position')
                    for player_dict in projections
                    for site_projection in player_dict.get('projection')
                    if site_projection.get('position')
                    if site_projection.get('siteId') == site_id}
        salary_dict = {player_dict.get('name'): int(site_projection.get('salary'))
                       for player_dict in projections
                       for site_projection in player_dict.get('projection')
                       if site_projection.get('siteId') == site_id}
    proj_points_dict = {player_dict.get('name'): float(site_projection.get('points'))
                        for player_dict in projections
                        for site_projection in player_dict.get('projection')
                        if site_projection.get('siteId') == site_id and player_dict.get('name') in salary_dict.keys()}
    team_and_weather_dict = {player_dict.get('name'): {'team': player_dict.get('team'),
                                                       'opponent': player_dict.get('opponent'),
                                                       'weather': player_dict.get('weather')}
                             for player_dict in projections}
    injury_info_dict = get_injury_info()
    injury_dict = {
        player: injury_info_dict.get(player.split(' ')[0] + ' ' + player.split(' ')[1]).get('status')
        for player in proj_points_dict.keys()
        if injury_info_dict.get(player.split(' ')[0] + ' ' + player.split(' ')[1])
        and pos_dict.get(player) == injury_info_dict.get(player.split(' ')[0]
                                                         + ' ' + player.split(' ')[1]).get('position')
    }
    return {
        'pos_dict': pos_dict,
        'salary_dict': salary_dict,
        'proj_points_dict': proj_points_dict,
        'team_and_weather_dict': team_and_weather_dict,
        'injury_dict': injury_dict,
        'master_dict': [
                      {'Position': pos_dict.get(player) if pos_dict.get(player) not in ('D', 'DST') else 'D/ST',
                       'Team': team_and_weather_dict.get(player).get('team') or 'unavailable',
                       'Name': player,
                       'Id': id_dict.get(player),
                       'Status': injury_dict.get(player) or '',
                       'Projected': round(proj_points_dict.get(player), 1),
                       'Price': salary_dict.get(player),
                       'Opp': team_and_weather_dict.get(player).get('opponent') or 'unavailable',
                       'Weather': team_and_weather_dict.get(player).get('weather') or 'unavailable'
                       } for player in proj_points_dict.keys()
        ]
    }


def get_dfs_lineup(sport, site, slate, projections, dfs_info, white_list, black_list, db):
    if sport == 'nba':
        return ['Warning: \nThis sport is currently unavailable.']
    if projections == 'offseason':
        return ['Warning: \nThis league is currently in the offseason.']
    if projections == 'Not enough data is available.':
        return ['Warning: \nThere are currently no games or projections for this league.']
    if projections == 'Error obtaining projection data.':
        return ['Warning: \nError obtaining projection data.']
    if sport == 'nfl' and not dfs_info:
        return ['Warning: \nThis contest is no longer available.']
    lineup_type = 'mvp' if slate == 'thurs' else 'standard'
    lineup_matrix = dfs_configs.get(site).get(sport).get(lineup_type).get('lineup_matrix')
    display_matrix = dfs_configs.get(site).get(sport).get(lineup_type).get('display_matrix')
    salary_cap = dfs_configs.get(site).get(sport).get(lineup_type).get('salary_cap')
    dicts = aggregate_player_info(sport, site, projections, dfs_info)
    dfs_lineup = output_lineup(lineup_matrix, display_matrix, sport, site, slate, white_list, black_list,
                               dicts.get('proj_points_dict'), dicts.get('pos_dict'), dicts.get('salary_dict'),
                               salary_cap, dicts.get('team_and_weather_dict'), dicts.get('injury_dict'), db)
    return dfs_lineup


def get_dfs_configs(sport, site, slate):
    lineup_type = 'mvp' if slate == 'thurs' else 'standard'
    display_matrix = dfs_configs.get(site).get(sport).get(lineup_type).get('display_matrix')
    salary_cap = dfs_configs.get(site).get(sport).get(lineup_type).get('salary_cap')
    return {
        'empty_lineup': [
            {'Position': position,
             'Team': '',
             'Name': '',
             'Id': '',
             'Status': '',
             'Projected': '',
             'Price': '',
             'Opp': '',
             'Weather': ''
             }
            for position in display_matrix
        ],
        'salary_cap': salary_cap
    }
