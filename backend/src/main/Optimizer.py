from itertools import combinations as comb

example_position_matrix = {'QB': [1, 1, 1], 'RB': [3, 2, 2], 'WR': [3, 4, 3], 'TE': [1, 1, 2], 'DST': [1, 1, 1]}
lineup_dict = {0: 'No lineup could be generated.'}


def get_total(players, data):
    data_list = [data.get(player) for player in players]
    return sum(data_list)


def optimize(position_matrix, proj_pts_dict, pos_dict, salary_dict, salary_cap):
    positions = position_matrix.keys()
    configurations = max([len(item) for item in position_matrix.values()])
    pos_lists = [[player for player in pos_dict.keys() if pos_dict.get(player) == pos]
                 for pos in positions]
    pos_lists_dict = dict(zip(positions, pos_lists))
    current_pts_list = [0 for _ in positions]
    current_salary_list = [0 for _ in positions]
    possible_lineup = [[] for _ in positions]
    final_lineups = {}
    best_lineup = []

    for n in range(configurations):
        combos_lists = [list(comb(pos_lists_dict.get(pos), position_matrix.get(pos)[n])) for pos in positions]
        max_pts_list = [max(get_total(combo, proj_pts_dict) for combo in combos) for combos in combos_lists]
        min_salary_list = [min(get_total(combo, salary_dict) for combo in combos) for combos in combos_lists]
        result = recursively_check(combos_lists, proj_pts_dict, salary_dict, current_pts_list, current_salary_list, [],
                                   possible_lineup, max_pts_list, min_salary_list, salary_cap, len(positions) - 1)
        final_lineups.update({result[0]: result[1]})
        best_lineup = final_lineups.get(max(final_lineups.keys()))

    return best_lineup


def recursively_check(combos_lists, proj_pts_dict, salary_dict, current_pts_list, current_salary_list, best_lineup,
                      possible_lineup, max_pts_list, min_salary_list, salary_cap, n):
    if n < 0:
        return
    else:
        for combo in combos_lists[n]:
            current_points = get_total(combo, proj_pts_dict)
            current_salary = get_total(combo, salary_dict)
            current_pts_list[n] = current_points
            current_salary_list[n] = current_salary
            potential_max_points = sum(
                [current_pts_list[i] for i in range(len(current_pts_list)) if i > n]) + sum(
                [max_pts_list[i] for i in range(len(max_pts_list)) if i <= n])
            potential_min_salary = sum(
                [current_salary_list[i] for i in range(len(current_salary_list)) if i > n]) + sum(
                [min_salary_list[i] for i in range(len(min_salary_list)) if i <= n])
            if potential_max_points > max(lineup_dict.keys()) and potential_min_salary <= salary_cap:
                possible_lineup[n] = combo

                total_points = sum(current_pts_list)
                total_salary = sum(current_salary_list)
                if n == 0 and total_points > max(lineup_dict.keys()) and total_salary <= salary_cap:
                    best_lineup = [player for combo in possible_lineup for player in combo]
                    lineup_dict.update({total_points: best_lineup})

                recursively_check(combos_lists, proj_pts_dict, salary_dict, current_pts_list, current_salary_list,
                                  best_lineup, possible_lineup, max_pts_list, min_salary_list, salary_cap, n - 1)

    final_lineup = lineup_dict.get(max(lineup_dict.keys()))
    total_proj_pts = sum([proj_pts_dict.get(player) for player in final_lineup]) if final_lineup != [
        'No lineup could be generated.'] else 0
    return [total_proj_pts, final_lineup]
