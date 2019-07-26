import requests
from bs4 import BeautifulSoup


def get_espn_html():
    session = requests.session()
    request = session.get('http://www.espn.com/fantasy/football/story/_/id/26692058/fantasy-football-updated-2019-non-ppr-rankings-mike-clay')
    if request.status_code != 200:
        return 'HTTP request failed.'
    doc = BeautifulSoup(request.content, 'html.parser')
    return str(doc.get_text)


def parse_html(text):
    string = [line for line in text.splitlines() if 'Non-PPR Top 300 for 2019' in line][0]
    words = string.split('<')
    return words


def get_player_dict():
    text = get_espn_html()
    if text == 'HTTP request failed.':
        return 'HTTP request failed.'
    words = parse_html(text)
    player_list = []
    num_list = list(str(range(300)))
    for word in words:
        if 'http://www.espn.com/nfl/player/_/id/' in word:
            name = word.split('>')
            player_list.append(name[1])
        elif 'td>' in word and '. ' in word and word.split('. ')[1]:
            player_list.append(word.split('. ')[1])
        elif 'D/ST' in word:
            d_name = word.split('. ')
            player_list.append(d_name[1])

    top_300_list = []
    for player in player_list:
        if player[-2:] == 'Jr':
            new_player = player.replace('Jr', 'Jr.')
            top_300_list.append(new_player)
        else:
            top_300_list.append(player)

    top_300_positions = []
    pos_list = ['td>QB', 'td>RB', 'td>WR', 'td>TE', 'td>DST', 'td>K']
    for word in words:
        if any(pos == word for pos in pos_list) and all(num not in word for num in num_list):
            position = word.split('>')
            top_300_positions.append(position[1])

    top300dict = dict(zip(top_300_list, top_300_positions))
    return top300dict


def get_espn_players():
    top300dict = get_player_dict()
    final_player_list = [player + '    (' + pos + ')' for player, pos in top300dict.items()]
    return final_player_list
