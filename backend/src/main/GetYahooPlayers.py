import requests
from bs4 import BeautifulSoup


# ranked player list that everyone drafts from
session = requests.session()
request = session.get('https://partners.fantasypros.com/external/widget/nfl-staff-rankings.php?source=2&id=7:8:9:285:699&year=2019&week=0&position=ALL&scoring=HALF&ajax=true&width=640&export=xls')
doc = BeautifulSoup(request.content, 'html.parser')
textList = str(doc.get_text).splitlines()
playerTextList = textList[4:-1]
playerAttrList = [item.split('\t')[1:-7] for item in playerTextList]

playerList = [item[0] for item in playerAttrList]

for player in playerList:
    if player[-2:] == 'Jr':
        player = player + '.'

positionList = []
for item in playerAttrList:
    if item[1].startswith('DST'):
        positionList.append(item[1][:3])
    elif item[1].startswith('K'):
        positionList.append(item[1][:1])
    else:
        positionList.append(item[1][:2])
top300dict = dict(zip(playerList, positionList))

final_player_list = [str(player) + '    (' + str(pos) + ')' for player, pos in top300dict.items()]


def get_yahoo_players():
    if request.status_code != 200:
        return 'HTTP request failed.'
    return final_player_list
