import requests
from bs4 import BeautifulSoup


def get_yahoo_players():
    session = requests.session()
    request = session.get('https://partners.fantasypros.com/external/widget/nfl-staff-rankings.php?source=2&id=7:8:9:285:699&year=2019&week=0&position=ALL&scoring=HALF&ajax=true&width=640&export=xls')
    if request.status_code != 200:
        return 'HTTP request failed.'
    doc = BeautifulSoup(request.content, 'html.parser')
    text_list = str(doc.get_text).splitlines()[4:-1]
    player_list = [item.split('\t')[1:4] for item in text_list]
    if not player_list:
        return ['This data is no longer available.']
    for player in player_list:
        if player[0][-2:] == 'Jr':
            player[0] = player[0] + '.'
        player[1] = ''.join([letter for letter in player[1] if not letter.isdigit()])

    top300dict = [{'Rank': i + 1, 'Name': player_list[i][0], 'Position': player_list[i][1], 'Team': player_list[i][2]}
                  for i in range(len(player_list))]
    return top300dict
