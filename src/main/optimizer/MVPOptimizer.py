from itertools import combinations as comb


def get_total(players, data_dict):
    data_list = [data_dict.get(player) for player in players]
    return sum(data_list)


def get_mvp_total(players, data_dict):
    data_list = [data_dict.get(player) for player in players]
    data_list[0] = data_list[0] * 1.5
    return sum(data_list)


def optimize_mvp(site, black_list, proj_dict, salary_dict, player_count, cap):
    best_combo = []
    max_pts = 0
    if proj_dict:
        players = [player for player in proj_dict.keys() if player not in black_list]
        lineup_combs = list(comb(players, player_count))
        for combo in lineup_combs:
            sorted_combo = sorted(combo, key=proj_dict.__getitem__, reverse=True)
            combo_pts = get_mvp_total(sorted_combo, proj_dict)
            if combo_pts > max_pts:
                combo_salary = get_mvp_total(sorted_combo, salary_dict) if site == 'dk' else get_total(sorted_combo, salary_dict)
                if combo_salary <= cap:
                    best_combo = sorted_combo
                    max_pts = combo_pts
    optimal_dict = {
        'lineup': best_combo,
        'total_pts': max_pts,
        'total_salary': (get_mvp_total(best_combo, salary_dict)
                         if site == 'dk' else get_total(best_combo, salary_dict)) if best_combo else 0,
        'max_pts': max_pts
    }
    return optimal_dict
