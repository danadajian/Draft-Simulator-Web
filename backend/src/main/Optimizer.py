import statistics
from src.main.MLBSalaries import *
from src.main.NBASalaries import *


def ignore_players(player_to_remove, black_list, pools):
    if player_to_remove:
        black_list.append(player_to_remove)
        for pool in pools:
            for player in black_list:
                if player in pool:
                    pool.remove(player)
    return pools


def best_lineup(lineup_matrix, ignored_player, black_list, proj_pts_dict, pos_dict):
    sorted_players = sorted(proj_pts_dict, key=proj_pts_dict.__getitem__, reverse=True)
    sorted_scores = [proj_pts_dict.get(player) for player in sorted_players]
    proj_pts_dict = dict(zip(sorted_players, sorted_scores))

    sorted_positions = [pos_dict.get(player) for player in sorted_players]
    pos_dict = dict(zip(sorted_players, sorted_positions))

    starting_pools = [
        [player for player in pos_dict.keys() if pos_dict.get(player) in spot or spot in pos_dict.get(player)] for spot
        in lineup_matrix]
    pools = ignore_players(ignored_player, black_list, starting_pools)
    if any(not pool for pool in pools):
        return 'Not enough positions currently available.'
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
                return 'Not enough players to sufficiently downgrade.'
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
            return 'Not enough players to sufficiently downgrade.'
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


def output_lineups(lineup_matrix, display_matrix, ignored_player, black_list, proj_dict, pos_dict, salary_dict, cap):
    the_list = best_lineup(lineup_matrix, ignored_player, black_list, proj_dict, pos_dict)
    if the_list == 'Not enough positions currently available.':
        return 'Not enough player data is currently available.'
    the_best_lineup, pools, proj_dict = the_list[0], the_list[1], the_list[2]
    optimal_lineup = optimize(the_best_lineup, pools, proj_dict, salary_dict, cap)
    print(optimal_lineup)
    if optimal_lineup == 'Not enough players to sufficiently downgrade.':
        return 'Not enough player data is currently available.'
    total_pts = round(sum([proj_dict.get(player) for player in optimal_lineup]), 1)
    total_salary = sum([salary_dict.get(player) for player in optimal_lineup])
    result_max = sum([proj_dict.get(player) for player in the_best_lineup])
    data = make_data_nice(display_matrix, optimal_lineup, proj_dict, salary_dict, total_pts, total_salary, result_max)
    return data


def get_fd_lineup(sport, ignored_player, black_list):
    if sport == 'mlb':
        fd_lineup_matrix = ['P', 'C 1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF', 'C 1B 2B 3B SS OF']
        fd_display_matrix = ['P', 'C/1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF', 'Util']
        fd_proj_dict = mlbPointsDict.get('Fanduel')
        fd_pos_dict = mlbPositionsDict.get('Fanduel')
        fd_salary_dict = mlbSalaryDict.get('Fanduel')
        fd_data = output_lineups(fd_lineup_matrix, fd_display_matrix, ignored_player, black_list, fd_proj_dict,
                                 fd_pos_dict, fd_salary_dict, 35000)
        if fd_data == 'Not enough player data is currently available.':
            return 'Not enough player data is currently available.'
        return fd_data
    elif sport == 'nba':
        fd_lineup_matrix = ['PG', 'PG', 'SG', 'SG', 'SF', 'SF', 'PF', 'PF', 'C']
        fd_proj_dict = nbaPointsDict.get('Fanduel')
        fd_pos_dict = nbaPositionsDict.get('Fanduel')
        fd_salary_dict = nbaSalaryDict.get('Fanduel')
        fd_data = output_lineups(fd_lineup_matrix, fd_lineup_matrix, ignored_player, black_list, fd_proj_dict,
                                 fd_pos_dict, fd_salary_dict, 60000)
        if fd_data == 'Not enough player data is currently available.':
            return 'Not enough player data is currently available.'
        return fd_data


def get_dk_lineup(sport, ignored_player, black_list):
    if sport == 'mlb':
        dk_lineup_matrix = ['P', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF']
        dk_proj_dict = mlbPointsDict.get('Draftkings')
        dk_pos_dict = mlbPositionsDict.get('Draftkings')
        dk_salary_dict = mlbSalaryDict.get('Draftkings')
        dk_data = output_lineups(dk_lineup_matrix, dk_lineup_matrix, ignored_player, black_list, dk_proj_dict,
                                 dk_pos_dict, dk_salary_dict, 50000)
        if dk_data == 'Not enough player data is currently available.':
            return 'Not enough player data is currently available.'
        return dk_data
    elif sport == 'nba':
        dk_lineup_matrix = ['PG', 'SG', 'SF', 'PF', 'C', 'PG SG', 'SF PF', 'PG SG SF PF C']
        dk_display_matrix = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'Util']
        dk_proj_dict = nbaPointsDict.get('Draftkings')
        dk_pos_dict = nbaPositionsDict.get('Draftkings')
        dk_salary_dict = nbaSalaryDict.get('Draftkings')
        dk_data = output_lineups(dk_lineup_matrix, dk_display_matrix, ignored_player, black_list, dk_proj_dict,
                                 dk_pos_dict, dk_salary_dict, 50000)
        if dk_data == 'Not enough player data is currently available.':
            return 'Not enough player data is currently available.'
        return dk_data
