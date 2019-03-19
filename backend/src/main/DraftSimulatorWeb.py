import requests
from bs4 import BeautifulSoup


def get_players():
    # ranked player list that everyone drafts from
    session = requests.session()
    request = session.get('http://www.espn.com/fantasy/football/story/_/page/18RanksPreseason300nonPPR/'
                          + '2018-fantasy-football-non-ppr-rankings-top-300')
    doc = BeautifulSoup(request.content, 'html.parser')
    text = str(doc.get_text)

    string = ''
    for line in text.splitlines():
        if 'section class="col-c chk-height nocontent"' in line:
            string = line

    words = string.split('<')

    top_300_list = []
    num_list = list(str(range(200)))
    for word in words:
        if 'http://www.espn.com/nfl/player/_/id/' in word:
            name = word.split('>')
            if 'http://' not in name:
                top_300_list.append(name[1])
        elif 'D/ST' in word:
            d_name = word.split('. ')
            if 'td>' not in d_name:
                top_300_list.append(d_name[1])
        elif 'http://www.espn.com/nfl/player/_/id/' not in word and 'td>' in word and any(
                num in word for num in num_list) and '.' in word:
            other_name = word.split('. ')
            if 'td>' not in other_name and other_name[1] != '':
                top_300_list.append(other_name[1])

    top_300_positions = []
    pos_list = ['td>QB', 'td>RB', 'td>WR', 'td>TE', 'td>DST', 'td>K']
    for word in words:
        if any(pos == word for pos in pos_list) and all(num not in word for num in num_list):
            position = word.split('>')
            top_300_positions.append(position[1])

    top300dict = dict(zip(top_300_list, top_300_positions))

    return str(top_300_list)
    # return str(top300dict)
