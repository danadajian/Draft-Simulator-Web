import statistics


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


def get_best_lineup(player_pools, white_list):
    if any(not pool for pool in player_pools):
        return None
    best_lineup, white_list_copy = [], white_list[:]
    for pool in player_pools:
        next_white_list = next((player for player in white_list_copy if player in pool), None)
        if next_white_list:
            best_lineup.append(next_white_list)
            white_list_copy.remove(next_white_list)
        else:
            next_best = next((player for player in pool if player not in best_lineup), None)
            if not next_best:
                return None
            best_lineup.append(next_best)
    return best_lineup


def best_first_downgrade(best_lineup, white_list, pools, proj_pts_dict, salary_dict, salary_cap):
    final_lineup = [player for player in best_lineup]
    current_salary = sum([salary_dict.get(player) for player in final_lineup])
    salary_min = statistics.mean(list(salary_dict.values()))
    while current_salary > salary_cap:
        current_lowest_cost, downgrade_index, new_player = None, None, None
        for player in final_lineup:
            if player in white_list:
                continue
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


def improve_lineup(lineup, max_pts, white_list, pools, proj_pts_dict, salary_dict, salary_cap):
    better_lineup = []
    for player in lineup:
        if player in white_list:
            continue
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


def maximize_improvement(lineup, white_list, pools, proj_pts_dict, salary_dict, salary_cap):
    max_pts = sum([proj_pts_dict.get(player) for player in lineup])
    while True:
        results_dict = improve_lineup(lineup, max_pts, white_list, pools, proj_pts_dict, salary_dict, salary_cap)
        better_lineup, new_max = results_dict.get('better_lineup'), results_dict.get('max_pts')
        if not better_lineup:
            return lineup
        lineup = better_lineup
        max_pts = new_max


def optimize(lineup_matrix, white_list, black_list, proj_pts_dict, pos_dict, salary_dict, salary_cap):
    player_pools = get_player_pools(lineup_matrix, black_list, proj_pts_dict, pos_dict, salary_dict)
    best_lineup = get_best_lineup(player_pools, white_list)
    initial_lineup, optimal_lineup = [], []
    if best_lineup:
        initial_lineup = best_first_downgrade(best_lineup, white_list, player_pools, proj_pts_dict, salary_dict,
                                              salary_cap)
    if initial_lineup:
        optimal_lineup = maximize_improvement(initial_lineup, white_list, player_pools, proj_pts_dict, salary_dict,
                                              salary_cap)
    optimal_dict = {
        'lineup': optimal_lineup,
        'total_pts': round(sum([proj_pts_dict.get(player) for player in optimal_lineup]), 2) if optimal_lineup else 0,
        'total_salary': sum([salary_dict.get(player) for player in optimal_lineup]) if optimal_lineup else 0,
        'max_pts': round(sum([proj_pts_dict.get(player) for player in best_lineup]), 2) if optimal_lineup else 0
    }
    return optimal_dict
