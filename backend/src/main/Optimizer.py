import statistics


def remove_ignored_players(player_pools, black_list):
    for pool in player_pools:
        for player in black_list:
            if player in pool:
                pool.remove(player)
    return player_pools


def get_player_pools(lineup_matrix, black_list, proj_pts_dict, pos_dict):
    sorted_players = sorted(proj_pts_dict, key=proj_pts_dict.__getitem__, reverse=True)
    sorted_positions = [pos_dict.get(player) for player in sorted_players]
    sorted_positions_dict = dict(zip(sorted_players, sorted_positions))
    player_pools_with_ignored = [[player for player in sorted_positions_dict.keys() if sorted_positions_dict.get(player) in spot or spot in sorted_positions_dict.get(player)]
                                 for spot in lineup_matrix]
    player_pools = remove_ignored_players(player_pools_with_ignored, black_list)
    return player_pools


def get_best_lineup(player_pools):
    if any(not pool for pool in player_pools):
        return 'Warning: \nNot enough player data currently available.'
    best_lineup = []
    for pool in player_pools:
        for player in pool:
            if player not in best_lineup:
                best_lineup.append(player)
                break
    return best_lineup


def optimize(best_lineup, pools, proj_pts_dict, salary_dict, salary_cap):
    optimal_lineup = [player for player in best_lineup]
    current_salary = sum([salary_dict.get(player) for player in optimal_lineup])
    salary_min = statistics.mean(list(salary_dict.values()))
    while current_salary > salary_cap:
        current_lowest_cost, downgrade_index, new_player = None, None, None
        for player in optimal_lineup:
            player_pool = pools[optimal_lineup.index(player)]
            if player in player_pool:
                player_index = player_pool.index(player)
            else:
                return 'Warning: \nToo many players removed. Unable to generate new lineup.'
            if player_index == len(player_pool) - 1 or player_pool[player_index + 1] in optimal_lineup or salary_dict.get(player) < salary_min:
                continue
            current_ratio = proj_pts_dict.get(player) / salary_dict.get(player)
            downgrade_ratio = proj_pts_dict.get(player_pool[player_index + 1]) / salary_dict.get(player_pool[player_index + 1])
            cost_to_downgrade = current_ratio - downgrade_ratio
            if not current_lowest_cost or cost_to_downgrade < current_lowest_cost:
                current_lowest_cost = cost_to_downgrade
                downgrade_index = optimal_lineup.index(player)
                new_player = player_pool[player_index + 1]
        if not new_player:
            return 'Warning: \nToo many players removed. Unable to generate new lineup.'
        optimal_lineup[downgrade_index] = new_player
        current_salary = sum([salary_dict.get(player) for player in optimal_lineup])
    return optimal_lineup


def make_data_nice(display_matrix, optimal_lineup, proj_dict, salary_dict, total_pts, total_salary, max_pts):
    data = [
        {'Position': display_matrix[optimal_lineup.index(player)], 'Player': player, 'Projected': proj_dict.get(player),
         'Price': '$' + str(salary_dict.get(player))} for player in optimal_lineup]
    data += [{'Position': '', 'Player': 'Total', 'Projected': total_pts, 'Price': '$' + str(total_salary)}]
    data += [
        {'Position': '', 'Player': 'Percent of Max Points', 'Projected': str(round(100 * (total_pts / max_pts))) + '%',
         'Price': ''}]
    data_str = str(data).replace("{'", '{"').replace("'}", '"}').replace("':", '":').replace(": '", ': "') \
        .replace("',", '",').replace(", '", ', "')
    return data_str


def output_lineup(lineup_matrix, display_matrix, black_list, proj_dict, pos_dict, salary_dict, cap):
    player_pools = get_player_pools(lineup_matrix, black_list, proj_dict, pos_dict)
    best_lineup = get_best_lineup(player_pools)
    if best_lineup == 'Warning: \nNot enough positions currently available.':
        return best_lineup
    optimal_lineup = optimize(best_lineup, player_pools, proj_dict, salary_dict, cap)
    if optimal_lineup == 'Warning: \nToo many players removed. Unable to generate new lineup.':
        return optimal_lineup
    total_pts = round(sum([proj_dict.get(player) for player in optimal_lineup]), 1)
    total_salary = sum([salary_dict.get(player) for player in optimal_lineup])
    result_max = sum([proj_dict.get(player) for player in best_lineup])
    lineup = make_data_nice(display_matrix, optimal_lineup, proj_dict, salary_dict, total_pts, total_salary, result_max)
    return lineup


def get_dfs_lineup(site, sport, projections_dict, black_list):
    lineup_matrix, display_matrix, salary_cap = None, None, None
    if sport == 'mlb':
        lineup_matrix = ['P', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF'] if site == 'dk' else ['P', 'C 1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF', 'C 1B 2B 3B SS OF']
        display_matrix = ['P', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF'] if site == 'dk' else ['P', 'C/1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF', 'Util']
        salary_cap = 50000 if site == 'dk' else 35000
    elif sport == 'nba':
        lineup_matrix = ['PG', 'SG', 'SF', 'PF', 'C', 'PG SG', 'SF PF', 'PG SG SF PF C'] if site == 'dk' else ['PG', 'PG', 'SG', 'SG', 'SF', 'SF', 'PF', 'PF', 'C']
        display_matrix = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'Util'] if site == 'dk' else ['PG', 'PG', 'SG', 'SG', 'SF', 'SF', 'PF', 'PF', 'C']
        salary_cap = 50000 if site == 'dk' else 60000
    site_id = 1 if site == 'dk' else 2
    proj_points_dict = {player: float(site_projection.get('points'))
                        for player in projections_dict.keys()
                        for site_projection in projections_dict.get(player)
                        if site_projection.get('siteId') == site_id}
    pos_dict = {player: site_projection.get('position')
                for player in projections_dict.keys()
                for site_projection in projections_dict.get(player)
                if site_projection.get('siteId') == site_id}
    salary_dict = {player: int(site_projection.get('salary'))
                   for player in projections_dict.keys()
                   for site_projection in projections_dict.get(player)
                   if site_projection.get('siteId') == site_id}
    dfs_lineup = output_lineup(lineup_matrix, display_matrix, black_list, proj_points_dict, pos_dict, salary_dict, salary_cap)
    return dfs_lineup
