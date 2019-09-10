import requests
import json
from .GetNFLData import get_date_string


def get_fd_salaries():
    url = 'https://www.fanduel.com/api/playerprices?date=' + get_date_string('Thurs')
    call = requests.get(url).text
    response = call.splitlines()
    lower_bound = next(i for i in range(len(response)) if '<game>' in response[i] and '<label>Thu-Mon</label>' in response[i + 2])
    upper_bound = next((j for j in range(lower_bound + 1, len(response)) if '<game>' in response[j]), len(response))
    salary_dict = {}
    for i in range(lower_bound, upper_bound):
        if '<player>' in response[i]:
            id_string = response[i + 7]
            id_lower = id_string.find('<statsid>') + 9
            id_upper = id_string.find('</statsid>')
            id = id_string[id_lower: id_upper]
            sal_string = response[i + 5]
            sal_lower = sal_string.find('<salary>') + 8
            sal_upper = sal_string.find('</salary>')
            salary = sal_string[sal_lower: sal_upper]
            salary_dict.update({int(id): int(salary)})
    return salary_dict


def get_dk_salaries():
    url = 'https://api.draftkings.com/partners/v1/draftpool/sports/nfl/?format=json'
    call = requests.get(url).text
    response = json.loads(call)
    contests = response.get('draftPool')
    players = next(contest for contest in contests
                   if contest.get('sport') == 'NFL'
                   and contest.get('gameType') == 'Classic'
                   and contest.get('suffix') == ' (Thu-Mon)').get('draftPool')
    salary_dict = {int(player.get('playerId')): int(player.get('salary')) for player in players}
    return salary_dict
