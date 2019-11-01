import requests
import json


def get_fd_info(contest, date_string):
    url = 'https://www.fanduel.com/api/playerprices?date=' + date_string
    call = requests.get(url).text
    response = call.splitlines()
    lower_bound = next((i for i in range(len(response))
                       if '<game>' in response[i] and '<label>' + contest + '</label>' in response[i + 2]
                       and '<player>' in response[i + 7]), -1)
    upper_bound = next((j for j in range(lower_bound + 1, len(response)) if '<game>' in response[j]), len(response))

    info_dict = {}
    if lower_bound + upper_bound == upper_bound - 1:
        return info_dict
    for i in range(lower_bound, upper_bound):
        if '<player>' in response[i]:
            id_string = response[i + 7]
            id_lower = id_string.find('<statsid>') + 9
            id_upper = id_string.find('</statsid>')
            id = id_string[id_lower: id_upper]
            pos_string = response[i + 2]
            pos_lower = pos_string.find('<position>') + 10
            pos_upper = pos_string.find('</position>')
            pos = pos_string[pos_lower: pos_upper]
            sal_string = response[i + 5]
            sal_lower = sal_string.find('<salary>') + 8
            sal_upper = sal_string.find('</salary>')
            salary = sal_string[sal_lower: sal_upper]
            info_dict.update({int(id): {'position': pos, 'salary': int(salary)}})
    return info_dict


def get_dk_info(contest, game_type):
    url = 'https://api.draftkings.com/partners/v1/draftpool/sports/nfl/?format=json'
    call = requests.get(url).text
    response = json.loads(call)
    contests = response.get('draftPool')
    contest = next((item for item in contests
                   if item.get('sport') == 'NFL'
                   and item.get('gameType') == game_type
                   and (contest == 'Main' or item.get('suffix') == ' (' + contest + ')')), None)
    info_dict = {int(player.get('playerId')): {'position': player.get('position'), 'salary': int(player.get('salary'))}
                 for player in contest.get('draftPool')
                 if game_type != 'Showdown Captain Mode' or player.get('rosterSlots')[0] == 'FLEX'} if contest else {}
    return info_dict
