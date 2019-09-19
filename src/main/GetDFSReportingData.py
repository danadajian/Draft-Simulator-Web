import requests
from .GetNFLData import *


defense_dict = {'San Francisco': '49ers', 'Tennessee': 'Titans', 'New York J': 'Jets', 'Minnesota': 'Vikings',
                'Green Bay': 'Packers', 'Baltimore': 'Ravens', 'Tampa Bay': 'Buccaneers', 'Seattle': 'Seahawks',
                'Buffalo': 'Bills', 'New England': 'Patriots', 'Chicago': 'Bears', 'LA Rams': 'Rams',
                'New Orleans': 'Saints', 'Detroit': 'Lions', 'Arizona': 'Cardinals', 'Indianapolis': 'Colts',
                'Cincinnati': 'Bengals', 'Dallas': 'Cowboys', 'Kansas City': 'Chiefs', 'Oakland': 'Raiders',
                'Carolina': 'Panthers', 'Houston': 'Texans', 'LA Chargers': 'Chargers', 'Philadelphia': 'Eagles',
                'Denver': 'Broncos', 'Cleveland': 'Browns', 'Atlanta': 'Falcons', 'Washington': 'Redskins',
                'Pittsburgh': 'Steelers', 'Miami': 'Dolphins', 'Jacksonville': 'Jaguars', 'New York G': 'Giants'}


def get_historical_dfs_info(week, site):
    url = 'http://rotoguru1.com/cgi-bin/fyday.pl?week=' + str(week) + '&game=' + site
    response = requests.get(url).text.splitlines()
    hist_dict = {}
    for line in response:
        if '<a href="http://rotoguru1.com/cgi-bin/playrf.cgi?' in line and 'Player Lookup' not in line:
            name_lower = line.find('target="_blank" >') + len('target="_blank" >')
            name_upper = line.find('</a>', name_lower)
            name = line[name_lower: name_upper]
            names = name.split(', ')
            last_name = names[0]
            full_name = names[1] + ' ' + last_name if len(names) > 1 else defense_dict.get(name) + ' D/ST' if defense_dict.get(name) else names[0]
            pts_lower = line.find('target="_blank" >', name_upper) + len('target="_blank" >')
            pts_upper = line.find('</a>', pts_lower)
            pts = line[pts_lower: pts_upper]
            salary_lower = line.find('<td align=right>', pts_upper) + len('<td align=right>')
            salary_upper = line.find('</td>', salary_lower)
            salary = line[salary_lower: salary_upper].replace('$', '').replace(',', '')
            if salary != 'N/A':
                hist_dict.update({full_name: {'points': float(pts), 'salary': int(salary)}})
    return hist_dict


def find_points_by_position(lineup, display_matrix, points_dict):
    positions = []
    for spot in display_matrix:
        if spot not in positions:
            positions.append(spot)
    points_by_position = {pos: 0 for pos in positions}
    if points_dict:
        for player in lineup:
            spot = display_matrix[lineup.index(player)]
            points_by_position[spot] += points_dict.get(player)
            points_by_position[spot] = round(points_by_position[spot], 2)
    return points_by_position


def get_reporting_data(projected_lineup, optimal_lineup, display_matrix, week, site, slate, proj_dict, scores_dict):
    projected_lineup_projected = find_points_by_position(projected_lineup, display_matrix, proj_dict)
    projected_lineup_actual = find_points_by_position(projected_lineup, display_matrix, scores_dict)
    optimal_lineup_actual = find_points_by_position(optimal_lineup, display_matrix, scores_dict)
    db_row = (
        week, site, slate, ','.join(projected_lineup), ','.join(optimal_lineup),
        projected_lineup_projected.get('QB'), projected_lineup_actual.get('QB'), optimal_lineup_actual.get('QB'),
        projected_lineup_projected.get('RB'), projected_lineup_actual.get('RB'), optimal_lineup_actual.get('RB'),
        projected_lineup_projected.get('WR'), projected_lineup_actual.get('WR'), optimal_lineup_actual.get('WR'),
        projected_lineup_projected.get('TE'), projected_lineup_actual.get('TE'), optimal_lineup_actual.get('TE'),
        projected_lineup_projected.get('FLEX'), projected_lineup_actual.get('FLEX'), optimal_lineup_actual.get('FLEX'),
        projected_lineup_projected.get('DST'), projected_lineup_actual.get('DST'), optimal_lineup_actual.get('DST')
    )
    return db_row


def aggregate_reporting_data(query_result):
    positions = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'D/ST']

    aggregated_data = [{
        'week': row[0],
        'site': row[1],
        'slate': row[2],
        'data': [
            {
                'position': pos,
                'expected': row[3*(positions.index(pos)) + 5],
                'actual': row[3*(positions.index(pos)) + 6],
                'optimal': row[3*(positions.index(pos)) + 7],
                'expected_v_actual': (row[3*(positions.index(pos)) + 5] - row[6]) / row[6],
                'actual_v_optimal': (row[6] - row[7]) / row[7],
                'expected_v_optimal': (row[5] - row[7]) / row[7]
            }
            for pos in positions],
        'qb_expected': row[5],
        'qb_actual': row[6],
        'qb_optimal': row[7]
    } for row in query_result]
    return aggregated_data
