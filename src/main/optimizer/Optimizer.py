import statistics
from .GetInjuries import *
from .MVPOptimizer import *
from src.main.optimizer.GetDFSReportingData import *
from src.main.optimizer.DfsConfigs import *


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
    initial_lineup, optimal_lineup = [], []
    if best_lineup:
        initial_lineup = best_first_downgrade(best_lineup, player_pools, proj_pts_dict, salary_dict, salary_cap)
    if initial_lineup:
        optimal_lineup = maximize_improvement(initial_lineup, player_pools, proj_pts_dict, salary_dict, salary_cap)
    optimal_dict = {
        'lineup': optimal_lineup,
        'total_pts': round(sum([proj_pts_dict.get(player) for player in optimal_lineup]), 2) if optimal_lineup else 0,
        'total_salary': sum([salary_dict.get(player) for player in optimal_lineup]) if optimal_lineup else 0,
        'max_pts': round(sum([proj_pts_dict.get(player) for player in best_lineup]), 2) if optimal_lineup else 0
    }
    return optimal_dict


def save_new_lineups(sport, week, site, slate, row, db):
    if slate == 'thurs':
        table = sport + '_mvp_lineups'
        columns = ['week', 'site', 'slate', 'projected_lineup', 'optimal_lineup', 'mvp_expected', 'mvp_actual',
                   'mvp_optimal', 'flex_expected', 'flex_actual', 'flex_optimal']
    else:
        table = sport + '_lineups'
        columns = ['week', 'site', 'slate', 'projected_lineup', 'optimal_lineup', 'qb_expected', 'qb_actual',
                   'qb_optimal', 'rb_expected', 'rb_actual', 'rb_optimal', 'wr_expected', 'wr_actual', 'wr_optimal',
                   'te_expected', 'te_actual', 'te_optimal', 'flex_expected', 'flex_actual', 'flex_optimal',
                   'dst_expected', 'dst_actual', 'dst_optimal']
    result = db.session.execute('SELECT * FROM ' + table +
                                ' WHERE week = ' + str(week) +
                                ' AND site = ' + "'" + site + "'" +
                                ' AND slate = ' + "'" + slate + "'" +
                                ' ORDER BY week, site')
    existing_rows = [row for row in result]
    if existing_rows:
        col_list = [columns[i] + ' = ' + (("'" + str(row[i]) + "'") if i in (1, 2, 3, 4) else str(row[i])) + ', '
                    for i in range(len(columns))]
        update_string = ''.join(col_list) + 'updated = CURRENT_TIMESTAMP'
        db.session.execute('UPDATE ' + table +
                           ' SET ' + update_string +
                           ' WHERE week = ' + str(week) +
                           ' AND site = ' + "'" + site + "'" +
                           ' AND slate = ' + "'" + slate + "'")
    else:
        db.session.execute('INSERT INTO ' + table + ' VALUES ' +
                           str(row)[:-1].replace("'NULL'", 'NULL') + ', CURRENT_TIMESTAMP)')
    db.session.commit()


def ingest_actual_optimal_data(lineup_matrix, display_matrix, site, sport, slate, black_list, proj_dict, pos_dict,
                               salary_dict, cap, projected_lineup, db):
    week = get_all_events()[0].get('week')
    scores_dict = {player: item.get('points') for player, item in get_historical_dfs_info(week, site).items()}
    if slate == 'thurs':
        optimal_lineup = optimize_mvp(site, black_list, scores_dict, salary_dict, len(display_matrix), cap).get('lineup')
    else:
        optimal_lineup = optimize(lineup_matrix, black_list, scores_dict, pos_dict, salary_dict, cap).get('lineup')
    new_row = get_reporting_data(projected_lineup, optimal_lineup, display_matrix, week, site, slate, proj_dict,
                                 scores_dict)
    if db:
        save_new_lineups(sport, week, site, slate, new_row, db)
    else:
        print(new_row)


def output_lineup(lineup_matrix, display_matrix, site, sport, slate, black_list, proj_dict, pos_dict, salary_dict, cap,
                  team_and_weather_dict, injured_dict, db):
    if slate == 'thurs':
        optimal_dict = optimize_mvp(site, black_list, proj_dict, salary_dict, len(display_matrix), cap)
    else:
        optimal_dict = optimize(lineup_matrix, black_list, proj_dict, pos_dict, salary_dict, cap)
    if not optimal_dict.get('lineup'):
        return 'Warning: \nNot enough data available to generate lineup.'
    projected_lineup = optimal_dict.get('lineup')
    total_pts = round(optimal_dict.get('total_pts'), 1)
    total_salary = round(optimal_dict.get('total_salary'))
    max_pts = optimal_dict.get('max_pts')
    if sport == 'nfl':
        ingest_actual_optimal_data(lineup_matrix, display_matrix, site, sport, slate, black_list, proj_dict, pos_dict,
                                   salary_dict, cap, projected_lineup, db)
    lineup_json = [
                      {'Position': display_matrix[projected_lineup.index(player)],
                       'Team': team_and_weather_dict.get(player).get('team') or 'unavailable',
                       'Name': player,
                       'Status': injured_dict.get(player) or '',
                       'Projected': round(proj_dict.get(player), 1),
                       'Price': '$' + '{:,}'.format(round(salary_dict.get(player) *
                                                          (1.5 if projected_lineup.index(player) == 0 else 1))
                                                    if slate == 'thurs' and site == 'dk' else salary_dict.get(player)),
                       'Opp': team_and_weather_dict.get(player).get('opponent') or 'unavailable',
                       'Weather': team_and_weather_dict.get(player).get('weather') or 'unavailable'
                       } for player in projected_lineup
                  ] + [
                      {'Position': '',
                       'Team': '',
                       'Name': 'Total',
                       'Status': '',
                       'Projected': total_pts,
                       'Price': '$' + '{:,}'.format(total_salary),
                       'Opp': '',
                       'Weather': {'forecast': '', 'details': ''}
                       }
                  ] + [
                      {'Position': '',
                       'Team': '',
                       'Name': 'Percent of Max Points',
                       'Status': '',
                       'Projected': str(round(100 * (total_pts / max_pts))) + '%',
                       'Price': '',
                       'Opp': '',
                       'Weather': {'forecast': '', 'details': ''}
                       }
                  ]
    return lineup_json


def get_dfs_lineup(site, sport, slate, projections, dfs_info, black_list, db):
    lineup_type = 'mvp' if slate == 'thurs' else 'standard'
    lineup_matrix = dfs_configs.get(site).get(sport).get(lineup_type).get('lineup_matrix')
    display_matrix = dfs_configs.get(site).get(sport).get(lineup_type).get('display_matrix')
    salary_cap = dfs_configs.get(site).get(sport).get(lineup_type).get('salary_cap')
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
    elif sport == 'nfl' and (not dfs_info.get('fd') or not dfs_info.get('dk')):
        return ['Warning: \nThis contest is no longer available.']
    else:
        fd_lineup = get_dfs_lineup('fd', sport, slate, projections, dfs_info.get('fd'), fd_black_list, db)
        dk_lineup = get_dfs_lineup('dk', sport, slate, projections, dfs_info.get('dk'), dk_black_list, db)
        return [fd_lineup, dk_lineup]
