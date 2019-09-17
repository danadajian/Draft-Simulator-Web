import statistics
from .GetInjuries import *
from .MVPOptimizer import *
from .GetHistoricalDFSInfo import *


def remove_ignored_players(player_pools, black_list):
    for pool in player_pools:
        for player in black_list:
            if player in pool:
                pool.remove(player)
    return player_pools


def is_valid_position(position, lineup_spot):
    if not position:
        return False
    return True if (
        position in lineup_spot or
        lineup_spot in position or
        any(pos in lineup_spot for pos in position.split('/')) or
        any(pos in position for pos in lineup_spot.split(' '))
    ) else False


def get_player_pools(lineup_matrix, black_list, proj_dict, pos_dict, salary_dict):
    sorted_players = sorted(proj_dict, key=proj_dict.__getitem__, reverse=True)
    sorted_positions = [pos_dict.get(player) for player in sorted_players if pos_dict.get(player)]
    sorted_positions_dict = dict(zip(sorted_players, sorted_positions))
    player_pools_with_ignored = [[player for player in sorted_positions_dict.keys()
                                  if is_valid_position(pos_dict.get(player), spot)
                                  and player in salary_dict.keys()]
                                 for spot in lineup_matrix]
    player_pools = remove_ignored_players(player_pools_with_ignored, black_list)
    return player_pools


def get_best_lineup(player_pools):
    if any(not pool for pool in player_pools):
        return None
    best_lineup = []
    for pool in player_pools:
        for player in pool:
            if player not in best_lineup:
                best_lineup.append(player)
                break
    return best_lineup


def best_first_downgrade(best_lineup, pools, proj_pts_dict, salary_dict, salary_cap):
    final_lineup = [player for player in best_lineup]
    current_salary = sum([salary_dict.get(player) for player in final_lineup])
    salary_min = statistics.mean(list(salary_dict.values()))
    while current_salary > salary_cap:
        current_lowest_cost, downgrade_index, new_player = None, None, None
        for player in final_lineup:
            player_pool = pools[final_lineup.index(player)]
            if player in player_pool:
                player_index = player_pool.index(player)
            else:
                return None
            if player_index == len(player_pool) - 1 or player_pool[player_index + 1] in final_lineup or salary_dict.get(player) < salary_min:
                continue
            current_ratio = proj_pts_dict.get(player) / salary_dict.get(player)
            downgrade_ratio = proj_pts_dict.get(player_pool[player_index + 1]) / salary_dict.get(player_pool[player_index + 1])
            cost_to_downgrade = current_ratio - downgrade_ratio
            if not current_lowest_cost or cost_to_downgrade < current_lowest_cost:
                current_lowest_cost = cost_to_downgrade
                downgrade_index = final_lineup.index(player)
                new_player = player_pool[player_index + 1]
        if not new_player:
            return None
        final_lineup[downgrade_index] = new_player
        current_salary = sum([salary_dict.get(player) for player in final_lineup])
    return final_lineup


def improve_lineup(lineup, max_pts, pools, proj_pts_dict, salary_dict, salary_cap):
    better_lineup = []
    for player in lineup:
        player_index = lineup.index(player)
        sorted_pool = pools[player_index]
        counter = 1
        while sorted_pool.index(player) - counter >= 0:
            new_lineup = [player for player in lineup]
            new_index = sorted_pool.index(player) - counter
            new_player = sorted_pool[new_index]
            if new_player not in new_lineup:
                new_lineup[player_index] = new_player
                if sum([proj_pts_dict.get(player) for player in new_lineup]) > max_pts \
                        and sum([salary_dict.get(player) for player in new_lineup]) <= salary_cap:
                    max_pts = sum([proj_pts_dict.get(player) for player in new_lineup])
                    better_lineup = new_lineup
            counter += 1
    return {'better_lineup': better_lineup, 'max_pts': max_pts}


def maximize_improvement(lineup, pools, proj_pts_dict, salary_dict, salary_cap):
    max_pts = sum([proj_pts_dict.get(player) for player in lineup])
    while True:
        results_dict = improve_lineup(lineup, max_pts, pools, proj_pts_dict, salary_dict, salary_cap)
        better_lineup, new_max = results_dict.get('better_lineup'), results_dict.get('max_pts')
        if not better_lineup:
            return lineup
        lineup = better_lineup
        max_pts = new_max


def optimize(lineup_matrix, black_list, proj_pts_dict, pos_dict, salary_dict, salary_cap):
    player_pools = get_player_pools(lineup_matrix, black_list, proj_pts_dict, pos_dict, salary_dict)
    best_lineup = get_best_lineup(player_pools)
    if not best_lineup:
        return None
    initial_lineup = best_first_downgrade(best_lineup, player_pools, proj_pts_dict, salary_dict, salary_cap)
    if not initial_lineup:
        return initial_lineup
    optimal_lineup = maximize_improvement(initial_lineup, player_pools, proj_pts_dict, salary_dict, salary_cap)
    if not optimal_lineup:
        return optimal_lineup
    optimal_dict = {
        'lineup': optimal_lineup,
        'total_pts': round(sum([proj_pts_dict.get(player) for player in optimal_lineup]), 2),
        'total_salary': sum([salary_dict.get(player) for player in optimal_lineup]),
        'max_pts': round(sum([proj_pts_dict.get(player) for player in best_lineup]), 2)
    }
    return optimal_dict


def save_new_lineups(db, sport, slate, week, rows):
    columns = ['week', 'site', 'type', 'lineup', 'qb_expected', 'qb_actual', 'rb_expected', 'rb_actual', 'wr_expected',
               'wr_actual', 'te_expected', 'te_actual', 'flex_expected', 'flex_actual', 'dst_expected', 'dst_actual',
               'total_expected', 'total_actual', 'lineup_salary']
    if db.session.execute('SELECT * FROM ' + sport + '_lineups' +
                          ' WHERE week = ' + str(week) +
                          ' AND slate = ' + slate +
                          ' ORDER BY week, site, type'):
        col_list = [columns[i] + ' = ' + str(row[i]) + ', ' for row in rows for i in range(len(columns)) if row]
        update_string = ''.join(col_list) + 'updated = CURRENT_TIMESTAMP'
        db.session.execute('UPDATE ' + sport + '_lineups ' +
                           ' SET ' + update_string +
                           ' WHERE week = ' + str(week) +
                           ' AND slate = ' + slate)
    else:
        for row in rows:
            if row:
                db.session.execute('INSERT INTO ' + sport + '_lineups VALUES ' + str(row)[:-1] + ', CURRENT_TIMESTAMP)')


def output_lineup(lineup_matrix, display_matrix, site, sport, slate, black_list, proj_dict, pos_dict, salary_dict, cap,
                  team_and_weather_dict, injured_dict, db):
    if slate == 'mvp':
        optimal_dict = optimize_mvp(black_list, proj_dict, salary_dict, len(display_matrix), cap)
    else:
        optimal_dict = optimize(lineup_matrix, black_list, proj_dict, pos_dict, salary_dict, cap)
    if not optimal_dict:
        return 'Warning: \nNot enough data available to generate lineup.'
    optimal_lineup = optimal_dict.get('lineup')
    total_pts = round(optimal_dict.get('total_pts'), 1)
    total_salary = optimal_dict.get('total_salary')
    max_pts = optimal_dict.get('max_pts')
    if sport == 'nfl' and db:
        week = get_all_events()[0].get('week')
        scores_dict = {player: item.get('points') for player, item in get_historical_dfs_info(week, site).items()}
        actual_optimal_dict = optimize(lineup_matrix, black_list, scores_dict, pos_dict, salary_dict, cap)
        proj_row = get_recap_data(optimal_lineup, display_matrix, week, site, 'projected', proj_dict, scores_dict, salary_dict)
        optimal_row = get_recap_data(actual_optimal_dict.get('lineup'), display_matrix, week, site, 'optimal', proj_dict, scores_dict, salary_dict) if actual_optimal_dict else ()
        rows = [proj_row, optimal_row]
        save_new_lineups(db, sport, slate, week, rows)
    lineup_json = [{'Position': display_matrix[optimal_lineup.index(player)],
                    'Team': team_and_weather_dict.get(player).get('team') or 'unavailable',
                    'Name': player,
                    'Status': injured_dict.get(player) or '',
                    'Projected': round(proj_dict.get(player), 1),
                    'Price': '$' + '{:,}'.format(salary_dict.get(player)),
                    'Opp': team_and_weather_dict.get(player).get('opponent') or 'unavailable',
                    'Weather': team_and_weather_dict.get(player).get('weather') or 'unavailable'
                    } for player in optimal_lineup] \
                  + [{'Position': '',
                      'Team': '',
                      'Name': 'Total',
                      'Status': '',
                      'Projected': total_pts,
                      'Price': '$' + '{:,}'.format(total_salary),
                      'Opp': '',
                      'Weather': {'forecast': '', 'details': ''}
                      }] \
                  + [{'Position': '',
                      'Team': '',
                      'Name': 'Percent of Max Points',
                      'Status': '',
                      'Projected': str(round(100 * (total_pts / max_pts))) + '%',
                      'Price': '',
                      'Opp': '',
                      'Weather': {'forecast': '', 'details': ''}
                      }]
    return lineup_json


def get_dfs_lineup(site, sport, slate, projections, dfs_info, black_list, db):
    slate = 'mvp' if slate == 'thurs' else 'main'
    lineup_matrix = dfs_configs.get(site).get(sport).get(slate).get('lineup_matrix')
    display_matrix = dfs_configs.get(site).get(sport).get(slate).get('display_matrix')
    salary_cap = dfs_configs.get(site).get(sport).get(slate).get('salary_cap')
    site_id = 1 if site == 'dk' else 2
    if sport == 'nfl':
        pos_dict = {player_dict.get('name'): dfs_info.get(player_dict.get('id')).get('position')
                    for player_dict in projections
                    for site_projection in player_dict.get('projection')
                    if site_projection.get('siteId') == site_id and dfs_info.get(player_dict.get('id'))}
        salary_dict = {player_dict.get('name'): dfs_info.get(player_dict.get('id')).get('salary')
                       for player_dict in projections
                       for site_projection in player_dict.get('projection')
                       if site_projection.get('siteId') == site_id and dfs_info.get(player_dict.get('id'))}
    else:
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
    injured_dict = {
        player: injury_info_dict.get(player.split(' ')[0] + ' ' + player.split(' ')[1]).get('status')
        for player in proj_points_dict.keys()
        if injury_info_dict.get(player.split(' ')[0] + ' ' + player.split(' ')[1])
        and pos_dict.get(player) == injury_info_dict.get(player.split(' ')[0]
                                                         + ' ' + player.split(' ')[1]).get('position')
    }
    dfs_lineup = output_lineup(lineup_matrix, display_matrix, site, sport, slate, black_list, proj_points_dict, pos_dict,
                               salary_dict, salary_cap, team_and_weather_dict, injured_dict, db)
    return dfs_lineup


def get_dfs_lineups(sport, projections, slate, dfs_info, fd_black_list, dk_black_list, db):
    if projections == 'offseason':
        return ['Warning: \nThis league is currently in the offseason.']
    elif projections == 'Not enough data is available.':
        return ['Warning: \nThere are currently no games or projections for this league.']
    elif projections == 'Error obtaining projection data.':
        return ['Warning: \nError obtaining projection data.']
    else:
        fd_lineup = get_dfs_lineup('fd', sport, slate, projections, dfs_info.get('fd'), fd_black_list, db)
        dk_lineup = get_dfs_lineup('dk', sport, slate, projections, dfs_info.get('dk'), dk_black_list, db)
        return [fd_lineup, dk_lineup]


dfs_configs = {
    'fd': {
        'mlb': {
            'main': {
                'lineup_matrix': ['P', 'C 1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF', 'C 1B 2B 3B SS OF'],
                'display_matrix': ['P', 'C/1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF', 'Util'],
                'salary_cap': 35000
            }
        },
        'nfl': {
            'main': {
                'lineup_matrix': ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'RB WR TE', 'DST'],
                'display_matrix': ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'FLEX', 'D/ST'],
                'salary_cap': 60000
            },
            'mvp': {
                'display_matrix': ['MVP (1.5x Points)', 'FLEX', 'FLEX', 'FLEX', 'FLEX'],
                'salary_cap': 60000
            }
        },
        'nba': {
            'main': {
                'lineup_matrix': ['PG', 'PG', 'SG', 'SG', 'SF', 'SF', 'PF', 'PF', 'C'],
                'display_matrix': ['PG', 'PG', 'SG', 'SG', 'SF', 'SF', 'PF', 'PF', 'C'],
                'salary_cap': 60000
            }
        }
    },
    'dk': {
        'mlb': {
            'main': {
                'lineup_matrix': ['P', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF'],
                'display_matrix': ['P', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF'],
                'salary_cap': 50000
            }
        },
        'nfl': {
            'main': {
                'lineup_matrix': ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'RB WR TE', 'DST'],
                'display_matrix': ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'FLEX', 'D/ST'],
                'salary_cap': 50000
            },
            'mvp': {
                'display_matrix': ['MVP (1.5x Points)', 'FLEX', 'FLEX', 'FLEX', 'FLEX', 'FLEX'],
                'salary_cap': 50000
            }
        },
        'nba': {
            'main': {
                'lineup_matrix': ['PG', 'SG', 'SF', 'PF', 'C', 'PG SG', 'SF PF', 'PG SG SF PF C'],
                'display_matrix': ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'Util'],
                'salary_cap': 50000
            }
        }
    }
}
