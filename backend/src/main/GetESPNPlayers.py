import requests
from bs4 import BeautifulSoup


def get_espn_html():
    session = requests.session()
    request = session.get('https://www.espn.com/fantasy/football/story/_/id/26415022/fantasy-football-updated-2019-ppr-rankings-mike-clay')
    if request.status_code != 200:
        return 'HTTP request failed.'
    doc = BeautifulSoup(request.content, 'html.parser')
    return str(doc.get_text)


def parse_html(text):
    string = [line for line in text.splitlines() if 'PPR Top 300 for 2019' in line][0]
    player_strings = []
    for i in range(300):
        left_index = string.find('<td>' + str(i + 1) + '.')
        right_index = string.find('<td>' + str(i + 2) + '.')
        player_strings.append(string[left_index: right_index])
    text_list = [player_string.split('>') for player_string in player_strings]
    return text_list


def get_espn_players():
    text = get_espn_html()
    if text == 'HTTP request failed.':
        return 'HTTP request failed.'
    text_list = parse_html(text)

    player_list, pos_list, team_list = [], [], []
    for string in text_list:
        if len(string) < 2:
            continue
        elif '<a href=' in string[1]:
            player_item = string[2]
            player = player_item.replace('</a', '')
            player_list.append(player)

            pos = string[5].replace('</td', '')
            pos_list.append(pos)

            team = string[7].replace('</td', '')
            team_list.append(team)
        else:
            player_item = string[1].replace('</td', '')
            start_index = player_item.find('. ') + 2
            player = player_item[start_index:]
            player_list.append(player)

            pos = string[3].replace('</td', '')
            pos_list.append(pos)

            team = string[5].replace('</td', '')
            team_list.append(team)

    top300dict = [{'Rank': i + 1, 'Name': player_list[i], 'Position': pos_list[i], 'Team': team_list[i]}
                  for i in range(len(player_list))]
    return top300dict
