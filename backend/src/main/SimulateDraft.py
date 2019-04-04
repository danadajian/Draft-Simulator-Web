from .PositionCheck import *
import random


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
        user_pick = draft_order.index('user_team')
        draft_order[user_pick], draft_order[pick_order - 1] = draft_order[pick_order - 1], draft_order[user_pick]
    return draft_order


def pick_players(user_list, team_dict, draft_order, round_count):
    user_team = team_dict.get('user_team')
    comp_list = [key for key in top300dict.keys()]
    draft_round = 0
    threshold = 2

    while any([len(team) < round_count for team in team_dict.values()]):
        for team in draft_order:
            if team == 'user_team':  # your pick logic
                if user_list:
                    while not valid_choice(user_list[0], user_team):
                        user_list.remove(user_list[0])
                    your_pick = user_list[0]
                    user_list.remove(your_pick)
                else:
                    your_threshold = threshold
                    your_pick = None
                    while not valid_choice(your_pick, user_team):
                        your_pick = comp_list[random.randint(0, min(len(comp_list) - 1, your_threshold))]
                        your_threshold += 1
                user_team.append(your_pick)
                comp_list.remove(your_pick)
            else:  # AI pick logic
                comp_threshold = threshold
                comp_pick = None
                while not valid_choice(comp_pick, team_dict.get(team)):
                    comp_pick = comp_list[random.randint(0, min(len(comp_list) - 1, comp_threshold))]
                    comp_threshold += 1
                team_dict.get(team).append(comp_pick)
                if comp_pick in user_list:
                    user_list.remove(comp_pick)
                comp_list.remove(comp_pick)
        draft_order = draft_order[::-1]  # reverses the draft order for every other round
        if draft_round % 2 == 0:
            threshold += 1  # makes the AI choose from a larger pool of players every other round
        draft_round += 1  # moves on to the next round

    return user_team


def simulate_draft(user_player_list, team_count, pick_order, round_count, simulations):
    drafted_teams = []
    if user_player_list == ['']:
        return drafted_teams
    for _ in range(simulations):
        user_list = [player for player in user_player_list]
        user_team = []
        team_dict = create_teams(team_count, user_team)
        draft_order = set_draft_order(team_dict, pick_order)
        drafted_team = pick_players(user_list, team_dict, draft_order, round_count)
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


def aggregate_data(freq_dict, user_player_list):
    sorted_players = sorted(freq_dict, key=freq_dict.__getitem__, reverse=True)
    sorted_freq = dict(zip(sorted_players, [freq_dict.get(item) for item in sorted_players]))
    freq_list = [{'Player': player, 'Position': top300dict.get(player), 'DraftFreq': str(freq) + '%'}
                 for player, freq in sorted_freq.items()]

    user_freq_dict = {}
    for player in user_player_list:
        if player in freq_dict.keys():
            user_freq_dict.update({player: freq_dict.get(player)})
        else:
            user_freq_dict.update({player: 0})
    sorted_user_players = sorted(user_freq_dict, key=user_freq_dict.__getitem__, reverse=True)
    sorted_user_freq = dict(zip(sorted_user_players, [user_freq_dict.get(item) for item in sorted_user_players]))
    user_freq_list = [{'Player': player, 'Position': top300dict.get(player), 'DraftFreq': str(freq) + '%'}
                      for player, freq in sorted_user_freq.items()]

    # the jqxgrid data bind requires double quotes...
    user_str = str(user_freq_list).replace("{'", '{"').replace("'}", '"}').replace("':", '":').replace(": '", ': "') \
        .replace("',", '",').replace(", '", ', "')
    total_str = str(freq_list).replace("{'", '{"').replace("'}", '"}').replace("':", '":').replace(": '", ': "')\
        .replace("',", '",').replace(", '", ', "')

    draft_frequencies = user_str + '|' + total_str
    return draft_frequencies
