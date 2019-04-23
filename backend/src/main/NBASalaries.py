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
    dfsUrl = 'http://rotoguru1.com/cgi-bin/hstats.cgi?pos=0&sort=3&game=' + str(site) + \
             '&colA=0&daypt=0&xavg=3&show=0&fltr=00'
    dfsReq = dfsSession.get(dfsUrl)
    dfsDoc = BeautifulSoup(dfsReq.content, 'html.parser')
    dfsText = str(dfsDoc.get_text)

    # lines containing players & salaries start with that substring
    dfsPlayerIndexList = []
    find_all(dfsText, '<a href="playrh.cgi?', dfsPlayerIndexList)

    dfsPlayerList = []
    dfsSalaryList = []
    dfsPointsList = []
    dfsPositionsList = []
    position_dict = {'1': 'PG', '2': 'SG', '3': 'SF', '4': 'PF', '5': 'C'}

    # find string indices of players and salaries and put them in lists
    for index in dfsPlayerIndexList:
        if dfsText.find(' 1<', index + 300, index + 450) != -1 or dfsText.find('<b>1</b>', index + 300, index + 450) != -1:
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
            fppg = float(statsList[3])
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
nbaSalaryDict = {'Fanduel': siteSalaries[0], 'Draftkings': siteSalaries[3]}
nbaPointsDict = {'Fanduel': siteSalaries[1], 'Draftkings': siteSalaries[4]}
nbaPositionsDict = {'Fanduel': siteSalaries[2], 'Draftkings': siteSalaries[5]}
