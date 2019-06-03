import requests
from bs4 import BeautifulSoup


# ranked player list that everyone drafts from
session = requests.session()
request = session.get('http://www.espn.com/fantasy/football/story/_/id/26692058/fantasy-football-updated-2019-non-ppr-rankings-mike-clay')
doc = BeautifulSoup(request.content, 'html.parser')
text = str(doc.get_text)

string = ''
for line in text.splitlines():
    if 'Non-PPR Top 300 for 2019' in line:
        string = line

words = string.split('<')

top300List = []
numList = list(str(range(300)))
for word in words:
    if 'http://www.espn.com/nfl/player/_/id/' in word:
        name = word.split('>')
        top300List.append(name[1])
    elif 'td>' in word and '. ' in word and word.split('. ')[1]:
        top300List.append(word.split('. ')[1])
    elif 'D/ST' in word:
        dName = word.split('. ')
        top300List.append(dName[1])

top300Positions = []
pos_list = ['td>QB', 'td>RB', 'td>WR', 'td>TE', 'td>DST', 'td>K']
for word in words:
    if any(pos == word for pos in pos_list) and all(num not in word for num in numList):
        position = word.split('>')
        top300Positions.append(position[1])

top300dict = dict(zip(top300List, top300Positions))

final_player_list = [str(player) + '    (' + str(pos) + ')' for player, pos in top300dict.items()]


def get_espn_players():
    if str(request) != '<Response [200]>':
        return 'HTTP request failed.'
    return str(final_player_list)
