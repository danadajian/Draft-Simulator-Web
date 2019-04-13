from itertools import combinations as comb

position_matrix = {'QB': [1, 1, 1], 'RB': [3, 2, 2], 'WR': [3, 4, 3], 'TE': [1, 1, 2], 'DST': [1, 1, 1]}


def get_total(players, data):
    data_list = [data.get(player) for player in players]
    return sum(data_list)


def optimize(position_matrix, proj_pts_dict, pos_dict, salary_dict, salary_cap):
    positions = position_matrix.keys()
    pos_iters = position_matrix.values()[0]
    for item in position_matrix.values():
        if len(item) > pos_iters:
            pos_iters = len(item)
    pos_lists = [[player for player in pos_dict.keys() if pos_dict.get(player) == pos]
                 for pos in positions]
    pos_lists_dict = dict(zip(positions, pos_lists))
    best_lineup = []
    max_points = 0
    for n in range(pos_iters):
        combos_lists = [list(comb(pos_lists_dict.get(pos), position_matrix.get(pos)[n])) for pos in positions]
        max_pts_list = [max([get_total(combos, proj_pts_dict)
                        for combos in combos_lists])]
        min_salary_list = [min([get_total(combos, salary_dict)
                           for combos in combos_lists])]
        potential_max_points = sum(max_pts_list)
        potential_min_salary = sum(min_salary_list)
        pos_index = 0
        # need to find a way to remove last player from last position's combos list
        while pos_index < len(positions):
            for combos in combos_lists:
                current_points = get_total(combos, proj_pts_dict)
                current_salary = get_total(combos, salary_dict)
                potential_max_points -= max_pts_list[pos_index]
                potential_max_points += current_points
                potential_min_salary -= min_salary_list[pos_index]
                potential_min_salary += current_salary
                if potential_max_points > max_points and potential_min_salary <= salary_cap:
                    best_lineup.append(combos)
                    pos_index += 1
                    break
            best_lineup.remove(best_lineup[len(best_lineup) - 1])
            pos_index -= 1



def old_optimize(score_dict, salary_dict, salary_cap, qb_list, rb_list, wr_list, te_list, dst_list):
    rb_count = [3, 2, 2]
    wr_count = [3, 4, 3]
    te_count = [1, 1, 2]
    best_lineup = []
    max_points = 0
    for n in range(3):
        max_wr_points = max([get_total(wrs, score_dict) for wrs in list(comb(wr_list, wr_count[n]))])
        min_wr_salary = min([get_total(wrs, salary_dict) for wrs in list(comb(wr_list, wr_count[n]))])
        max_te_points = max([get_total(tes, score_dict) for tes in list(comb(te_list, te_count[n]))])
        min_te_salary = min([get_total(tes, salary_dict) for tes in list(comb(te_list, te_count[n]))])
        max_dst_points = max([score_dict.get(dst) for dst in dst_list])
        min_dst_salary = min([salary_dict.get(dst) for dst in dst_list])
        flex = ''
        for qb in qb_list:
            qb_points = score_dict.get(qb)
            qb_salary = salary_dict.get(qb)
            for rbs in comb(rb_list, rb_count[n]):
                rb_points = get_total(rbs, score_dict)
                rb_salary = get_total(rbs, salary_dict)
                potential_max_points = qb_points + rb_points + max_wr_points + max_te_points + max_dst_points
                potential_max_salary = qb_salary + rb_salary + min_wr_salary + min_te_salary + min_dst_salary
                if potential_max_points > max_points and potential_max_salary <= salary_cap:
                    for wrs in comb(wr_list, wr_count[n]):
                        wr_points = get_total(wrs, score_dict)
                        wr_salary = get_total(wrs, salary_dict)
                        potential_max_points = qb_points + rb_points + wr_points + max_te_points + max_dst_points
                        potential_max_salary = qb_salary + rb_salary + wr_salary + min_te_salary + min_dst_salary
                        if potential_max_points > max_points and potential_max_salary <= salary_cap:
                            for tes in comb(te_list, te_count[n]):
                                te_points = get_total(tes, score_dict)
                                te_salary = get_total(tes, salary_dict)
                                potential_max_points = qb_points + rb_points + wr_points + te_points + max_dst_points
                                potential_max_salary = qb_salary + rb_salary + wr_salary + te_salary + min_dst_salary
                                if potential_max_points > max_points and potential_max_salary <= salary_cap:
                                    for dst in dst_list:
                                        dst_points = score_dict.get(dst)
                                        dst_salary = salary_dict.get(dst)
                                        point_total = qb_points + rb_points + wr_points + te_points + dst_points
                                        total_salary = qb_salary + rb_salary + wr_salary + te_salary + dst_salary
                                        if point_total > max_points and total_salary <= salary_cap:
                                            if len(rbs) > 2:
                                                flex = rbs[2]
                                            elif len(wrs) > 3:
                                                flex = wrs[3]
                                            elif len(tes) > 1:
                                                flex = tes[1]
                                            best_lineup = [qb, rbs[0], rbs[1], wrs[0], wrs[1], wrs[2], tes[0], flex,
                                                           dst]
                                            max_points = point_total

    return best_lineup
