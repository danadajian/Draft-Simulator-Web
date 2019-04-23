import requests
from bs4 import BeautifulSoup


# defines function that finds all string indices of a substring
def find_all(string, substring, indices):
    x = -1
    while True:
        x = string.find(substring, x + 1)
        if x == -1:
            break
        indices.append(x)


# set up request to site for both DraftKings and Fanduel salaries
sites = ['d', 'k']
siteSalaries = []
for site in sites:
    # make http request to scrape html
    dfsSession = requests.session()
    dfsUrl = 'http://rotoguru1.com/cgi-bin/stats.cgi?pos=0&sort=3&game=' + str(site) + \
             '&colA=0&daypt=0&denom=1&xavg=0&inact=0&maxprc=99999&sched=1&starters=1&hithand=1&numlist=z'
    dfsReq = dfsSession.get(dfsUrl)
    dfsDoc = BeautifulSoup(dfsReq.content, 'html.parser')
    dfsText = str(dfsDoc.get_text)

    # lines containing players & salaries start with that substring
    dfsPlayerIndexList = []
    find_all(dfsText, '<a href="player.cgi?', dfsPlayerIndexList)

    dfsPlayerList = []
    dfsSalaryList = []
    dfsPointsList = []
    dfsPositionsList = []
    position_dict = {'1': 'P', '2': 'C', '3': '1B', '4': '2B', '5': '3B', '6': 'SS', '7': 'OF'}

    # find string indices of players and salaries and put them in lists
    for index in dfsPlayerIndexList:
        dfsLowerNameIndex = dfsText.find('>', index) + 1
        dfsUpperNameIndex = dfsText.find('<', dfsLowerNameIndex)
        dfsLowerSalaryIndex = dfsText.find('</font>', dfsUpperNameIndex) - 7
        dfsPlayer = dfsText[dfsLowerNameIndex: dfsUpperNameIndex]
        dfsSalaryText = dfsText[dfsLowerSalaryIndex: dfsLowerSalaryIndex + 7]
        dfsAmount = dfsSalaryText[1:]
        dfsSalary = int(dfsAmount[:dfsAmount.find(',')] + dfsAmount[dfsAmount.find(',') + 1:])
        if dfsSalary == 0:
            continue
        dfsSalaryList.append(dfsSalary)
        dfsLowerStatsIndex = dfsLowerSalaryIndex + 14
        dfsUpperStatsIndex = dfsLowerStatsIndex + 50
        statsList = dfsText[dfsLowerStatsIndex: dfsUpperStatsIndex].split()
        fppg = float(statsList[4])
        dfsPointsList.append(fppg)
        dfsPosition = dfsText[index - 3: index].strip()
        if dfsPosition.startswith('SP'):
            dfsPosition = 'P'
        if site == 'k':
            if len(dfsPosition) == 1:
                dfsPosition = position_dict.get(dfsPosition)
            else:
                pos1 = position_dict.get(dfsPosition[0])
                pos2 = position_dict.get(dfsPosition[1])
                dfsPosition = pos1 + ' ' + pos2
        dfsPositionsList.append(dfsPosition)
        dfsLastNameIndex = dfsText.find(',', dfsLowerNameIndex)
        dfsLastName = dfsText[dfsLowerNameIndex: dfsLastNameIndex]
        dfsFirstName = (dfsText[dfsLastNameIndex + 1: dfsUpperNameIndex])[1:]
        dfsPlayerName = str(dfsFirstName) + ' ' + str(dfsLastName)
        dfsPlayerList.append(dfsPlayerName)

    # put players and salaries into dictionary
    dfsPlayersAndSalaries = dict(zip(dfsPlayerList, dfsSalaryList))
    siteSalaries.append(dfsPlayersAndSalaries)

    dfsPlayersAndPoints = dict(zip(dfsPlayerList, dfsPointsList))
    siteSalaries.append(dfsPlayersAndPoints)

    dfsPlayersAndPositions = dict(zip(dfsPlayerList, dfsPositionsList))
    siteSalaries.append(dfsPlayersAndPositions)

# accumulates salaries from each site
mlbSalaryDict = {'Fanduel': siteSalaries[0], 'Draftkings': siteSalaries[3]}
mlbPointsDict = {'Fanduel': siteSalaries[1], 'Draftkings': siteSalaries[4]}
mlbPositionsDict = {'Fanduel': siteSalaries[2], 'Draftkings': siteSalaries[5]}
