import statistics


def best_lineup(lineup_matrix, proj_pts_dict, pos_dict):
    sorted_players = sorted(proj_pts_dict, key=proj_pts_dict.__getitem__, reverse=True)
    sorted_scores = [proj_pts_dict.get(player) for player in sorted_players]
    proj_pts_dict = dict(zip(sorted_players, sorted_scores))

    sorted_positions = [pos_dict.get(player) for player in sorted_players]
    pos_dict = dict(zip(sorted_players, sorted_positions))

    pools = [[player for player in pos_dict.keys() if pos_dict.get(player) in spot or spot in pos_dict.get(player)]
             for spot in lineup_matrix]
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
            player_index = pools[i].index(optimal_lineup[i])
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


def output_lineups(fd_lineup_matrix, fd_display_matrix, dk_lineup_matrix, dk_display_matrix, points_dict,
                   positions_dict, salary_dict, fd_cap, dk_cap):
    fd_proj_dict = points_dict.get('Fanduel')
    dk_proj_dict = points_dict.get('Draftkings')
    fd_pos_dict = positions_dict.get('Fanduel')
    dk_pos_dict = positions_dict.get('Draftkings')
    fd_salary_dict = salary_dict.get('Fanduel')
    dk_salary_dict = salary_dict.get('Draftkings')
    fd_list = best_lineup(fd_lineup_matrix, fd_proj_dict, fd_pos_dict)
    fd_best_lineup, fd_pools, fd_proj_dict = fd_list[0], fd_list[1], fd_list[2]
    fd_optimal_lineup = optimize(fd_best_lineup, fd_pools, fd_proj_dict, fd_salary_dict, fd_cap)
    fd_total_pts = round(sum([fd_proj_dict.get(player) for player in fd_optimal_lineup]), 1)
    fd_total_salary = sum([fd_salary_dict.get(player) for player in fd_optimal_lineup])
    fd_max = sum([fd_proj_dict.get(player) for player in fd_best_lineup])
    dk_list = best_lineup(dk_lineup_matrix, dk_proj_dict, dk_pos_dict)
    dk_best_lineup, dk_pools, dk_proj_dict = dk_list[0], dk_list[1], dk_list[2]
    dk_optimal_lineup = optimize(dk_best_lineup, dk_pools, dk_proj_dict, dk_salary_dict, dk_cap)
    dk_total_pts = round(sum([dk_proj_dict.get(player) for player in dk_optimal_lineup]), 1)
    dk_total_salary = sum([dk_salary_dict.get(player) for player in dk_optimal_lineup])
    dk_max = sum([dk_proj_dict.get(player) for player in dk_best_lineup])
    fd_data = make_data_nice(fd_display_matrix, fd_optimal_lineup, fd_proj_dict, fd_salary_dict, fd_total_pts,
                             fd_total_salary, fd_max)
    dk_data = make_data_nice(dk_display_matrix, dk_optimal_lineup, dk_proj_dict, dk_salary_dict, dk_total_pts,
                             dk_total_salary, dk_max)
    return fd_data + '|' + dk_data
