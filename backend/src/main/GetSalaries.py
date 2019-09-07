import requests
from .GetNFLData import get_sunday_string


def get_fd_salaries():
    url = 'https://www.fanduel.com/api/playerprices?date=' + get_sunday_string()
    call = requests.get(url).text
    response = call.splitlines()
    lower_bound = next(i for i in range(len(response)) if '<game>' in response[i] and '<label>Sun-Mon</label>' in response[i + 2])
    upper_bound = next(j for j in range(lower_bound + 1, len(response)) if '<game>' in response[j])
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
