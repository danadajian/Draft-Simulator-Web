import requests
import json


def get_fd_info(date_string):
    url = 'https://www.fanduel.com/api/playerprices?date=' + date_string
    call = requests.get(url).text
    response = call.splitlines()
    lower_bound = next(i for i in range(len(response))
                       if '<game>' in response[i] and '<label>Thu-Mon</label>' in response[i + 2])
    upper_bound = next((j for j in range(lower_bound + 1, len(response)) if '<game>' in response[j]), len(response))
    info_dict = {}
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


def get_fd_mvp_info(matchup, date_string):
    matchup = matchup.replace('JAX', 'JAC')
    url = 'https://www.fanduel.com/api/playerprices?date=' + date_string
    call = requests.get(url).text
    response = call.splitlines()
    lower_bound = next(i for i in range(len(response))
                       if '<game>' in response[i] and '<label>' + matchup + '</label>' in response[i + 2])
    upper_bound = next((j for j in range(lower_bound + 1, len(response)) if '<game>' in response[j]), len(response))
    info_dict = {}
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


def get_dk_info():
    url = 'https://api.draftkings.com/partners/v1/draftpool/sports/nfl/?format=json'
    call = requests.get(url).text
    response = json.loads(call)
    contests = response.get('draftPool')
    players = next(contest for contest in contests
                   if contest.get('sport') == 'NFL'
                   and contest.get('gameType') == 'Classic'
                   and contest.get('suffix') == ' (Thu-Mon)').get('draftPool')
    info_dict = {int(player.get('playerId')): {'position': player.get('position'), 'salary': int(player.get('salary'))}
                 for player in players}
    return info_dict


def get_dk_mvp_info(matchup):
    url = 'https://api.draftkings.com/partners/v1/draftpool/sports/nfl/?format=json'
    call = requests.get(url).text
    response = json.loads(call)
    contests = response.get('draftPool')
    players = next(contest for contest in contests
                   if contest.get('sport') == 'NFL'
                   and contest.get('gameType') == 'Showdown Captain Mode'
                   and contest.get('suffix') == ' (' + matchup + ')').get('draftPool')
    info_dict = {int(player.get('playerId')): {'position': player.get('position'), 'salary': int(player.get('salary'))}
                 for player in players}
    return info_dict
