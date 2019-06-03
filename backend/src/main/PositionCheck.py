from .GetESPNPlayers import top300dict


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
    player_pos_list = []
    pos_list = ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'RB WR TE', 'DST', 'K', 'BE', 'BE', 'BE', 'BE', 'BE', 'BE', 'BE']
    for spot in pos_list:
        for player in team:
            if player not in ordered_team:
                if spot != 'BE':
                    player_pos = top300dict.get(player)
                    if player_pos in spot:
                        ordered_team.append(player)
                        if spot == 'RB WR TE':
                            player_pos_list.append('FLEX')
                        else:
                            player_pos_list.append(top300dict.get(player))
                        break
                else:
                    ordered_team.append(player)
                    player_pos_list.append('BE')
    ordered_team_list = [{'Position': player_pos_list[ordered_team.index(player)], 'Player': player,
                          'DraftFreq': str(freq_dict.get(player)) + '%'} for player in ordered_team]
    ordered_team_str = str(ordered_team_list).replace("{'", '{"').replace("'}", '"}').replace("': '", '": "')\
        .replace("',", '",').replace(", '", ', "').replace("':", '":')
    return ordered_team_str
