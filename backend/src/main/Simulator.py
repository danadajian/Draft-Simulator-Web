import random


def position_count(player_list, pos_dict, pos):
    result = [player for player in player_list if pos_dict.get(player) == pos]
    return len(result)


def is_valid_choice(player, pos_dict, team):
    if player and player not in team:
        pos_limits = {'QB': 2, 'RB': 5, 'WR': 5, 'TE': 2, 'DST': 1, 'K': 1}
        player_pos = pos_dict.get(player)
        if player_pos and position_count(team, pos_dict, player_pos) < pos_limits.get(player_pos):
            return True
    return False


def create_teams(team_count):
    team_dict = {}
    for i in range(team_count - 1):
        n = i + 2
        team_dict['team_%s' % n] = []
    team_dict.update({'user_team': []})
    return team_dict


def set_draft_order(team_dict, pick_order):
    draft_order = [team for team in team_dict.keys()]
    if pick_order == 0:
        random.shuffle(draft_order)
    else:
        user_index = draft_order.index('user_team')
        draft_order[user_index], draft_order[pick_order - 1] = draft_order[pick_order - 1], draft_order[user_index]
    return draft_order


def pick_players(user_list, team_dict, pos_dict, draft_order, round_count):
    user_team = team_dict.get('user_team')
    comp_list = list(pos_dict.keys())
    round_index = 0
    pick_threshold = 2

    while any([len(team) < round_count for team in team_dict.values()]):
        user_round_list = user_list[round_index] if round_index < len(user_list) else None
        for team in draft_order:
            if team == 'user_team':
                next_pick = None
                if user_round_list:
                    next_pick = next((player for player in user_round_list
                                      if is_valid_choice(player, pos_dict, user_team)), None)
                if next_pick:
                    user_round_list.remove(next_pick)
                else:
                    your_threshold = pick_threshold
                    while not is_valid_choice(next_pick, pos_dict, user_team):
                        next_pick = comp_list[random.randint(0, min(len(comp_list) - 1, your_threshold))]
                        your_threshold += 1
                user_team.append(next_pick)
                comp_list.remove(next_pick)
            else:
                comp_threshold = pick_threshold
                comp_pick = None
                while not is_valid_choice(comp_pick, pos_dict, team_dict.get(team)):
                    comp_pick = comp_list[random.randint(0, min(len(comp_list) - 1, comp_threshold))]
                    comp_threshold += 1
                team_dict.get(team).append(comp_pick)
                for round_list in user_list:
                    if comp_pick in round_list:
                        round_list.remove(comp_pick)
                comp_list.remove(comp_pick)
        draft_order = draft_order[::-1]
        if round_index % 2 == 0:
            pick_threshold += 1
        round_index += 1
    return user_team


def simulate_draft(user_player_list, pos_dict, team_count, pick_order, round_count, simulations):
    drafted_teams = []
    for _ in range(simulations):
        user_list = [[player for player in user_round_list] for user_round_list in user_player_list]
        team_dict = create_teams(team_count)
        draft_order = set_draft_order(team_dict, pick_order)
        drafted_team = pick_players(user_list, team_dict, pos_dict, draft_order, round_count)
        drafted_teams.append(drafted_team)
    return drafted_teams


def get_player_round_dict(drafted_teams):
    player_round_dict = {player: team.index(player) + 1 for team in drafted_teams for player in team}
    return player_round_dict


def get_user_round_dict(user_list):
    user_round_dict = {player: user_list.index(round_list) + 1 for round_list in user_list for player in round_list}
    return user_round_dict


def calculate_frequencies(player_list):
    frequencies = {}
    for player in player_list:
        if player in frequencies.keys():
            frequencies[player] += 1
        else:
            frequencies[player] = 1
    for key, value in frequencies.items():
        frequencies[key] = 100 * value / len(player_list)
    return frequencies


def get_frequencies(drafted_teams, user_round_dict, round_count):
    picks_by_round = []
    round_index = 0
    while round_index < round_count:
        picks_this_round = [team[round_index] for team in drafted_teams]
        picks_by_round.append(picks_this_round)
        round_index += 1
    all_draft_frequencies, matched_players = {}, []
    for round_picks in picks_by_round:
        frequencies = calculate_frequencies(round_picks)
        for player in frequencies.keys():
            if user_round_dict.get(player) == picks_by_round.index(round_picks) + 1:
                matched_players.append(player)
        all_draft_frequencies.update(frequencies)
    for player in all_draft_frequencies.keys():
        if user_round_dict.get(player) and player not in matched_players:
            all_draft_frequencies[player] = 0
    return all_draft_frequencies


def get_sorted_players(freq_dict, round_dict):
    sorted_players = sorted(freq_dict, key=lambda item: (round_dict.get(item), -freq_dict.get(item)))
    return sorted_players


def get_expected_team(draft_frequencies, pos_dict, round_dict, round_count):
    expected_team = []
    current_round = 1
    while current_round <= round_count:
        freq_this_round = {player: draft_frequencies.get(player) for player, draft_round in round_dict.items()
                           if draft_round == current_round}
        most_to_least_drafted_this_round = sorted(freq_this_round, key=freq_this_round.__getitem__, reverse=True)
        player = next((player for player in most_to_least_drafted_this_round
                       if is_valid_choice(player, pos_dict, expected_team)), None)
        if player:
            expected_team.append(player)
        current_round += 1
    return expected_team


def order_expected_team_and_assign_positions(team, pos_dict):
    starting_lineup = [''] * 9
    bench = []
    new_position_dict = {}
    position_order = ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'RB WR TE', 'DST', 'K']
    for player in team:
        position = pos_dict.get(player)
        player_index = next((position_order.index(spot) for spot in position_order if position in spot), -1)
        if player_index == -1:
            bench.append(player)
            new_position_dict.update({player: 'BE'})
        else:
            starting_lineup[player_index] = player
            position_order[player_index] = ''
            new_position_dict.update({player: 'FLEX' if player_index == 6 else position})
    ordered_team = [player for player in starting_lineup if player]
    full_team = ordered_team + bench
    ordered_team_dict = {player: new_position_dict.get(player) for player in full_team}
    return ordered_team_dict


def jsonify(player_list, pos_dict, team_dict, round_dict, freq_dict):
    freq_list = [{'Name': player,
                  'Position': pos_dict.get(player),
                  'Team': team_dict.get(player),
                  'Round': round_dict.get(player),
                  'Frequency': str(freq_dict.get(player)) + '%'}
                 for player in player_list]
    return freq_list


def get_draft_results(user_list, player_dict, team_count, pick_order, round_count):
    pos_dict = {player.get('Name'): player.get('Position') for player in player_dict}
    team_dict = {player.get('Name'): player.get('Team') for player in player_dict}
    teams_drafted = simulate_draft(user_list, pos_dict, team_count, pick_order, round_count, 500)
    user_round_dict = get_user_round_dict(user_list)
    actual_round_dict = get_player_round_dict(teams_drafted)
    freq_dict = get_frequencies(teams_drafted, user_round_dict, round_count)
    user_freq_dict = {player: freq_dict.get(player) if freq_dict.get(player) else 0
                      for round_list in user_list for player in round_list}
    user_players_sorted = get_sorted_players(user_freq_dict, user_round_dict)
    all_players_sorted = get_sorted_players(freq_dict, actual_round_dict)
    expected_team = get_expected_team(freq_dict, pos_dict, actual_round_dict, round_count)
    expected_team_dict = order_expected_team_and_assign_positions(expected_team, pos_dict)
    jsonified_user_frequencies = jsonify(user_players_sorted, pos_dict, team_dict, user_round_dict, user_freq_dict)
    jsonified_frequencies = jsonify(all_players_sorted, pos_dict, team_dict, actual_round_dict, freq_dict)
    jsonified_expected_team = jsonify(
        expected_team_dict.keys(), expected_team_dict, team_dict, actual_round_dict, freq_dict)
    draft_results = {'UserFrequencies': jsonified_user_frequencies,
                     'AllFrequencies': jsonified_frequencies,
                     'ExpectedTeam': jsonified_expected_team}
    return draft_results
