from itertools import combinations as comb


def get_total(players, data):
    data_list = [data.get(player) for player in players]
    return sum(data_list)


def get_total_with_mvp(players, data):
    data_list = [(data.get(players[i]) * 1.5 if i == 0 else data.get(players[i])) for i in range(len(players))]
    return sum(data_list)


def optimize_mvp(black_list, proj_dict, salary_dict, player_count, cap):
    players = [player for player in proj_dict.keys() if player not in black_list]
    lineup_combs = list(comb(players, player_count))
    max_pts = 0
    best_combo = None
    for combo in lineup_combs:
        sorted_combo = sorted(combo, key=proj_dict.__getitem__, reverse=True)
        combo_pts = get_total_with_mvp(sorted_combo, proj_dict)
        if combo_pts > max_pts:
            combo_salary = get_total(combo, salary_dict)
            if combo_salary <= cap:
                best_combo = sorted_combo
                max_pts = combo_pts
    if not best_combo:
        return best_combo
    optimal_dict = {
        'lineup': best_combo,
        'total_pts': max_pts,
        'total_salary': get_total(best_combo, salary_dict),
        'max_pts': max_pts
    }
    return optimal_dict
