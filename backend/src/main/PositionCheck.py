from .GetPlayers import top300dict


# functions for ensuring teams draft appropriate positions
def position_count(player_list, pos):
    result = [player for player in player_list if top300dict.get(player) == pos]
    return len(result)


def valid_choice(player, team):
    if player:
        pos_limits = {'QB': 2, 'RB': 5, 'WR': 5, 'TE': 2, 'DST': 1, 'K': 1}
        player_pos = top300dict.get(player)
        if position_count(team, player_pos) + 1 <= pos_limits.get(player_pos):
            return True
    return False


def order_team(team, freq_dict):
    ordered_team = []
    pos_list = ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'RB WR TE', 'DST', 'K', 'BE', 'BE', 'BE', 'BE', 'BE', 'BE', 'BE']
    for spot in pos_list:
        for player in team:
            if player not in ordered_team:
                if spot != 'BE':
                    player_pos = top300dict.get(player)
                    if player_pos in spot:
                        ordered_team.append(player)
                        break
                else:
                    ordered_team.append(player)
    pos_list[6] = 'FLEX'
    ordered_team_list = [{'Position': pos_list[i], 'Player': ordered_team[i],
                          'DraftFreq': str(freq_dict.get(ordered_team[i])) + '%'} for i in range(len(ordered_team))]
    ordered_team_str = str(ordered_team_list).replace("{'", '{"').replace("'}", '"}').replace("': '", '": "')\
        .replace("',", '",').replace(", '", ', "').replace("':", '":')
    return ordered_team_str
