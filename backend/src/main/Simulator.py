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


def create_teams(team_count, user_team):
    team_dict = {}
    for i in range(team_count - 1):
        n = i + 2
        team_dict['team_%s' % n] = []
    team_dict.update({'user_team': user_team})
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
    draft_round = 0
    pick_threshold = 2

    while any([len(team) < round_count for team in team_dict.values()]):
        for team in draft_order:
            if team == 'user_team':
                next_pick = None
                if user_list:
                    next_pick = next((player for player in user_list if is_valid_choice(player, pos_dict, user_team)), None)
                if next_pick:
                    user_list.remove(next_pick)
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
                if comp_pick in user_list:
                    user_list.remove(comp_pick)
                comp_list.remove(comp_pick)
        draft_order = draft_order[::-1]
        if draft_round % 2 == 0:
            pick_threshold += 1
        draft_round += 1

    return user_team


def simulate_draft(user_player_list, pos_dict, team_count, pick_order, round_count, simulations):
    drafted_teams = []
    for _ in range(simulations):
        user_list = [player for player in user_player_list]
        user_team = []
        team_dict = create_teams(team_count, user_team)
        draft_order = set_draft_order(team_dict, pick_order)
        drafted_team = pick_players(user_list, team_dict, pos_dict, draft_order, round_count)
        drafted_teams.append(drafted_team)
    return drafted_teams


def calculate_frequencies(drafted_teams):
    all_draft_picks = [j for i in drafted_teams for j in i]
    draft_frequency = {}
    for player in all_draft_picks:
        if player in draft_frequency.keys():
            draft_frequency[player] += 1
        else:
            draft_frequency[player] = 1
    for key, value in draft_frequency.items():
        draft_frequency[key] = 100 * value / len(drafted_teams)
    return draft_frequency


def get_expected_team(draft_frequencies, pos_dict, round_count):
    most_to_least_drafted = sorted(draft_frequencies, key=draft_frequencies.__getitem__, reverse=True)
    expected_team = []
    index = 0
    while len(expected_team) < round_count:
        player = most_to_least_drafted[index]
        if is_valid_choice(player, pos_dict, expected_team):
            expected_team.append(player)
        index += 1
    return expected_team


def order_expected_team(team, pos_dict, freq_dict):
    ordered_team = [''] * 9
    bench = []
    lineup_order = ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'RB WR TE', 'DST', 'K']
    for player in team:
        pos = pos_dict.get(player)
        first_index = next((lineup_order.index(spot) for spot in lineup_order if pos == spot or pos in spot), -1)
        if first_index == -1:
            bench.append(player)
        else:
            ordered_team[first_index] = player
            lineup_order[first_index] = ''
    ordered_team = [player for player in ordered_team if player]
    full_team = ordered_team + bench
    ordered_expected_team = [{'Position': 'FLEX' if full_team.index(player) == 6 else pos_dict.get(player) if full_team.index(player) < 9 else 'BE',
                              'Player': player,
                              'DraftFreq': str(freq_dict.get(player)) + '%'} for player in full_team]
    return ordered_expected_team


def get_freq(freq_dict, pos_dict):
    sorted_players = sorted(freq_dict, key=freq_dict.__getitem__, reverse=True)
    sorted_freq = dict(zip(sorted_players, [freq_dict.get(item) for item in sorted_players]))
    freq_list = [{'Position': pos_dict.get(player), 'Player': player, 'DraftFreq': str(freq) + '%'}
                 for player, freq in sorted_freq.items()]
    return freq_list


def get_user_freq(freq_dict, user_player_list, pos_dict):
    user_freq_dict = {}
    for player in user_player_list:
        if player in freq_dict.keys():
            user_freq_dict.update({player: freq_dict.get(player)})
        else:
            user_freq_dict.update({player: 0})
    sorted_user_players = sorted(user_freq_dict, key=user_freq_dict.__getitem__, reverse=True)
    sorted_user_freq = dict(zip(sorted_user_players, [user_freq_dict.get(item) for item in sorted_user_players]))
    user_freq_list = [{'Position': pos_dict.get(player), 'Player': player, 'DraftFreq': str(freq) + '%'}
                      for player, freq in sorted_user_freq.items()]
    return user_freq_list


def get_draft_results(user_list, pos_dict, team_count, pick_order, round_count):
    teams_drafted = simulate_draft(user_list, pos_dict, team_count, pick_order, round_count, 500)
    player_draft_freq = calculate_frequencies(teams_drafted)
    expected_team = get_expected_team(player_draft_freq, pos_dict, round_count)
    ordered_expected_team = order_expected_team(expected_team, pos_dict, player_draft_freq)
    all_frequencies = get_freq(player_draft_freq, pos_dict)
    user_frequencies = get_user_freq(player_draft_freq, user_list, pos_dict)
    draft_results = {'AllFrequencies': all_frequencies,
                     'UserFrequencies': user_frequencies,
                     'ExpectedTeam': ordered_expected_team}
    return draft_results
