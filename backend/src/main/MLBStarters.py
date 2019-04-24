import requests
from bs4 import BeautifulSoup
import unicodedata


# defines function that finds all string indices of a substring
def find_all(string, substring, indices):
    x = -1
    while True:
        x = string.find(substring, x + 1)
        if x == -1:
            break
        indices.append(x)


def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return u"".join([c for c in nfkd_form if not unicodedata.combining(c)])


# make http request to scrape html
dfsSession = requests.session()
dfsUrl = 'https://www.mlb.com/starting-lineups'
dfsReq = dfsSession.get(dfsUrl)
dfsDoc = BeautifulSoup(dfsReq.content, 'html.parser')
dfsText = str(dfsDoc.get_text)

# lines containing players & salaries start with that substring
playerIndexList = []
find_all(dfsText, 'class="starting-lineups__player"><a class="starting-lineups__player--link"', playerIndexList)

startersList = []

# find string indices of players and salaries and put them in lists
for index in playerIndexList:
    lowerNameIndex = dfsText.find('>', index + len(
        'class="starting-lineups__player"><a class="starting-lineups__player--link"')) + 1
    upperNameIndex = dfsText.find('<', lowerNameIndex)
    player = dfsText[lowerNameIndex: upperNameIndex]
    firstAndLast = player.split(' ')
    playerName = firstAndLast[0][0] + ' ' + firstAndLast[1]
    unaccentedName = remove_accents(playerName)
    if unaccentedName not in startersList:
        startersList.append(unaccentedName)
