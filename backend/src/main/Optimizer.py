import statistics


def ignore_players(black_list, pools):
    for pool in pools:
        for player in black_list:
            if player in pool:
                pool.remove(player)
    return pools


def best_lineup(lineup_matrix, black_list, proj_pts_dict, pos_dict):
    sorted_players = sorted(proj_pts_dict, key=proj_pts_dict.__getitem__, reverse=True)
    sorted_scores = [proj_pts_dict.get(player) for player in sorted_players]
    proj_pts_dict = dict(zip(sorted_players, sorted_scores))

    sorted_positions = [pos_dict.get(player) for player in sorted_players]
    pos_dict = dict(zip(sorted_players, sorted_positions))

    starting_pools = [
        [player for player in pos_dict.keys() if pos_dict.get(player) in spot or spot in pos_dict.get(player)] for spot
        in lineup_matrix]
    pools = ignore_players(black_list, starting_pools)
    if any(not pool for pool in pools):
        return 'Warning: \nNot enough player data currently available.'
    starting_lineup = []
    while len(starting_lineup) < len(pools):
        for pool in pools:
            for i in range(len(pool)):
                if pool[i] not in starting_lineup:
                    starting_lineup.append(pool[i])
                    break
    return [starting_lineup, pools, proj_pts_dict]


def optimize(starting_lineup, pools, proj_pts_dict, salary_dict, salary_cap):
    optimal_lineup = [player for player in starting_lineup]
    current_salary = sum([salary_dict.get(player) for player in optimal_lineup])
    salary_threshold = statistics.mean(list(salary_dict.values()))
    while current_salary > salary_cap:
        min_cost = 100
        downgrade_index = None
        new_player = None
        for i in range(len(optimal_lineup)):
            try:
                player_index = pools[i].index(optimal_lineup[i])
            except ValueError:
                return 'Warning: \nToo many players removed. Unable to generate new lineup.'
            if len(pools[i]) == player_index + 1 or salary_dict.get(pools[i][player_index]) < salary_threshold or \
                    pools[i][player_index + 1] in optimal_lineup:
                continue
            current_ratio = proj_pts_dict.get(pools[i][player_index]) / salary_dict.get(pools[i][player_index])
            downgrade_ratio = proj_pts_dict.get(pools[i][player_index + 1]) / salary_dict.get(
                pools[i][player_index + 1])
            cost_to_downgrade = current_ratio - downgrade_ratio
            if cost_to_downgrade < min_cost:
                min_cost = cost_to_downgrade
                downgrade_index = i
                new_player = pools[i][player_index + 1]
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
    the_list = best_lineup(lineup_matrix, black_list, proj_dict, pos_dict)
    if the_list == 'Warning: \nNot enough positions currently available.':
        return the_list
    the_best_lineup, pools, proj_dict = the_list[0], the_list[1], the_list[2]
    optimal_lineup = optimize(the_best_lineup, pools, proj_dict, salary_dict, cap)
    if optimal_lineup == 'Warning: \nToo many players removed. Unable to generate new lineup.':
        return optimal_lineup
    total_pts = round(sum([proj_dict.get(player) for player in optimal_lineup]), 1)
    total_salary = sum([salary_dict.get(player) for player in optimal_lineup])
    result_max = sum([proj_dict.get(player) for player in the_best_lineup])
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
    dfs_lineup = output_lineup(lineup_matrix, display_matrix, black_list, proj_points_dict, pos_dict, salary_dict,
                               salary_cap)
    return dfs_lineup
