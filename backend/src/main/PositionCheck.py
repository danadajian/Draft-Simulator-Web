from GetPlayers import top300dict


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
