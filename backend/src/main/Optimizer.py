nfl_matrix = ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'RB WR TE', 'DST']
mlb_matrix = ['P', 'C 1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF', 'C 1B 2B 3B SS OF']
lineup_dict = {0: 'No lineup could be generated.'}


def get_total(players, data):
    data_list = [data.get(player) for player in players]
    return sum(data_list)


def optimize(lineup_matrix, proj_pts_dict, pos_dict, salary_dict, salary_cap):
    pools = [[player for player in pos_dict.keys() if pos_dict.get(player) in spot or spot in pos_dict.get(player)]
             for spot in lineup_matrix]
    current_pts_list = [0 for _ in pools]
    current_salary_list = [0 for _ in pools]
    possible_lineup = ['' for _ in pools]
    final_lineups = {}
    max_pts_list = [max(proj_pts_dict.get(player) for player in pool) for pool in pools]
    min_salary_list = [min(salary_dict.get(player) for player in pool) for pool in pools]

    def recursively_check(player_pools, n):
        if n < 0:
            return
        else:
            for player in player_pools[n]:
                if player in possible_lineup:
                    continue
                current_pts_list[n] = proj_pts_dict.get(player)
                current_salary_list[n] = salary_dict.get(player)
                potential_max_points = sum(
                    [current_pts_list[i] for i in range(len(current_pts_list)) if i > n]) + sum(
                    [max_pts_list[i] for i in range(len(max_pts_list)) if i <= n])
                potential_min_salary = sum(
                    [current_salary_list[i] for i in range(len(current_salary_list)) if i > n]) + sum(
                    [min_salary_list[i] for i in range(len(min_salary_list)) if i <= n])
                if potential_max_points > max(lineup_dict.keys()) and potential_min_salary <= salary_cap:
                    possible_lineup[n] = player

                    total_points = sum(current_pts_list)
                    total_salary = sum(current_salary_list)
                    if n == 0 and total_points > max(lineup_dict.keys()) and total_salary <= salary_cap:
                        new_lineup = [player for player in possible_lineup]
                        lineup_dict.update({total_points: new_lineup})

                    recursively_check(player_pools, n - 1)

        final_lineup = lineup_dict.get(max(lineup_dict.keys()))
        total_proj_pts = sum([proj_pts_dict.get(player) for player in final_lineup]) if final_lineup != [
            'No lineup could be generated.'] else 0
        return [total_proj_pts, final_lineup]

    result = recursively_check(pools, len(pools) - 1)

    final_lineups.update({result[0]: result[1]})

    best_lineup = final_lineups.get(max(final_lineups.keys()))
    lineup_data = [{'Position': pos_dict.get(player), 'Player': player, 'Projected': proj_pts_dict.get(player),
                    'Price': salary_dict.get(player)} for player in best_lineup]
    lineup_str = str(lineup_data).replace("{'", '{"').replace("'}", '"}').replace("':", '":').replace(": '", ': "') \
        .replace("',", '",').replace(", '", ', "')
    return lineup_str
