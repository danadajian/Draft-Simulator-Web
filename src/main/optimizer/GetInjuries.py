import requests


def get_injury_info():
    url = 'http://www.espn.com/nfl/injuries'
    response = requests.get(url).text.splitlines()
    injury_dict = {}
    for line in response:
        if '<tr class="oddrow player-' in line or '<tr class="evenrow player-' in line:
            first_index = line.find('<td><a href="http://www.espn.com/nfl/player/')
            lower_player = line.find('">', first_index) + 2
            upper_player = line.find('</td>', lower_player)
            player_string = line[lower_player: upper_player]
            if '</a>' in player_string:
                player = player_string.split('</a>, ')[0]
                player = player.split(' ')[0] + ' ' + player.split(' ')[1]
                position = player_string.split('</a>, ')[1]
                lower_status = line.find('<td>', upper_player) + 4
                upper_status = line.find('</td>', lower_status)
                status = line[lower_status: upper_status]
                if status == 'Injury Reserve':
                    status = 'IR'
                elif status == 'Questionable':
                    status = 'Q'
                elif status == 'Out':
                    status = 'O'
                elif status == 'Doubtful':
                    status = 'D'
                elif status == 'Suspension':
                    status = 'SUSP'
                else:
                    status = ''
                injury_dict.update({player: {'position': position, 'status': status}})
    return injury_dict
