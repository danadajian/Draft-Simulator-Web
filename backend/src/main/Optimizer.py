import statistics


def get_total(players, data):
    data_list = [data.get(player) for player in players]
    return sum(data_list)


def optimize(lineup_matrix, proj_pts_dict, pos_dict, salary_dict, salary_cap):
    sorted_players = sorted(proj_pts_dict, key=proj_pts_dict.__getitem__, reverse=True)
    sorted_scores = [proj_pts_dict.get(player) for player in sorted_players]
    proj_pts_dict = dict(zip(sorted_players, sorted_scores))

    sorted_positions = [pos_dict.get(player) for player in sorted_players]
    pos_dict = dict(zip(sorted_players, sorted_positions))

    pools = [[player for player in pos_dict.keys() if pos_dict.get(player) in spot or spot in pos_dict.get(player)]
             for spot in lineup_matrix]
    current_lineup = []
    while len(current_lineup) < len(pools):
        for pool in pools:
            for i in range(len(pool)):
                if pool[i] not in current_lineup:
                    current_lineup.append(pool[i])
                    break

    current_salary = sum([salary_dict.get(player) for player in current_lineup])
    salary_threshold = statistics.mean(list(salary_dict.values()))
    while current_salary > salary_cap:
        min_cost = 100
        downgrade_index = None
        new_player = None
        for i in range(len(current_lineup)):
            player_index = pools[i].index(current_lineup[i])
            if len(pools[i]) == player_index + 1 or salary_dict.get(pools[i][player_index]) < salary_threshold or \
                    pools[i][player_index + 1] in current_lineup:
                continue
            current_ratio = proj_pts_dict.get(pools[i][player_index]) / salary_dict.get(pools[i][player_index])
            downgrade_ratio = proj_pts_dict.get(pools[i][player_index + 1]) / salary_dict.get(pools[i][player_index + 1])
            cost_to_downgrade = current_ratio - downgrade_ratio
            if cost_to_downgrade < min_cost:
                min_cost = cost_to_downgrade
                downgrade_index = i
                new_player = pools[i][player_index + 1]
        current_lineup[downgrade_index] = new_player
        current_salary = sum([salary_dict.get(player) for player in current_lineup])

    return current_lineup
