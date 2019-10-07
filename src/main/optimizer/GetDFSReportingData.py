from src.main.optimizer.GetNFLData import *


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
    if not points_dict:
        return {pos: 'NULL' for pos in positions}
    points_by_position = {pos: 0 for pos in positions}
    if points_dict:
        for player in lineup:
            if points_dict.get(player):
                spot = display_matrix[lineup.index(player)]
                points_by_position[spot] += points_dict.get(player)
                points_by_position[spot] = round(points_by_position[spot], 2)
    return points_by_position


def get_reporting_data(projected_lineup, optimal_lineup, display_matrix, week, site, slate, proj_dict, scores_dict):
    projected_lineup_projected = find_points_by_position(projected_lineup, display_matrix, proj_dict)
    projected_lineup_actual = find_points_by_position(projected_lineup, display_matrix, scores_dict)
    optimal_lineup_actual = find_points_by_position(optimal_lineup, display_matrix, scores_dict)
    if slate == 'thurs':
        db_row = (
            week, site, slate,
            ','.join(projected_lineup).replace("'", ''),
            ','.join(optimal_lineup).replace("'", ''),
            projected_lineup_projected.get('MVP (1.5x Points)') or 'NULL',
            projected_lineup_actual.get('MVP (1.5x Points)') or 'NULL',
            optimal_lineup_actual.get('MVP (1.5x Points)') or 'NULL',
            projected_lineup_projected.get('FLEX') or 'NULL',
            projected_lineup_actual.get('FLEX') or 'NULL',
            optimal_lineup_actual.get('FLEX') or 'NULL'
        )
    else:
        db_row = (
            week, site, slate,
            ','.join(projected_lineup).replace("'", ''),
            ','.join(optimal_lineup).replace("'", ''),
            projected_lineup_projected.get('QB') or 'NULL', projected_lineup_actual.get('QB') or 'NULL',
            optimal_lineup_actual.get('QB') or 'NULL', projected_lineup_projected.get('RB') or 'NULL',
            projected_lineup_actual.get('RB') or 'NULL', optimal_lineup_actual.get('RB') or 'NULL',
            projected_lineup_projected.get('WR') or 'NULL', projected_lineup_actual.get('WR') or 'NULL',
            optimal_lineup_actual.get('WR') or 'NULL', projected_lineup_projected.get('TE') or 'NULL',
            projected_lineup_actual.get('TE') or 'NULL', optimal_lineup_actual.get('TE') or 'NULL',
            projected_lineup_projected.get('FLEX') or 'NULL', projected_lineup_actual.get('FLEX') or 'NULL',
            optimal_lineup_actual.get('FLEX') or 'NULL', projected_lineup_projected.get('D/ST') or 'NULL',
            projected_lineup_actual.get('D/ST') or 'NULL', optimal_lineup_actual.get('D/ST') or 'NULL'
        )
    return db_row


def get_query_results(sport, slate, site, weeks, db):
    if not db:
        return {}
    if slate == 'thurs':
        data_result = [row for row in
                       db.session.execute('SELECT SUM(mvp_expected), SUM(mvp_actual), SUM(mvp_optimal),' +
                                          ' SUM(flex_expected), SUM(flex_actual), SUM(flex_optimal)' +
                                          ' FROM ' + sport + '_mvp_lineups' +
                                          ' WHERE slate = ' + "'" + slate + "'" +
                                          ' AND COALESCE(mvp_actual, flex_actual, NULL) IS NOT NULL' +
                                          ((' AND week IN ' + '(' + weeks + ')') if weeks else '') +
                                          ((' AND site = ' + "'" + site + "'") if site else ''))][0]
        max_week_result = [row for row in
                           db.session.execute('SELECT MAX(week) max_week' +
                                              ' FROM ' + sport + '_mvp_lineups' +
                                              ' WHERE slate = ' + "'" + slate + "'" +
                                              ' AND COALESCE(mvp_actual, flex_actual, NULL) IS NOT NULL')][0][0]
    else:
        data_result = [row for row in
                       db.session.execute('SELECT SUM(qb_expected), SUM(qb_actual), SUM(qb_optimal),' +
                                          ' SUM(rb_expected), SUM(rb_actual), SUM(rb_optimal),' +
                                          ' SUM(wr_expected), SUM(wr_actual), SUM(wr_optimal),' +
                                          ' SUM(te_expected), SUM(te_actual), SUM(te_optimal),' +
                                          ' SUM(flex_expected), SUM(flex_actual), SUM(flex_optimal),' +
                                          ' SUM(dst_expected), SUM(dst_actual), SUM(dst_optimal)' +
                                          ' FROM ' + sport + '_lineups' +
                                          ' WHERE slate = ' + "'" + slate + "'" +
                                          ' AND COALESCE(qb_actual, rb_actual, wr_actual, te_actual,' +
                                          ' flex_actual, dst_actual, NULL) IS NOT NULL' +
                                          ((' AND week IN ' + '(' + weeks + ')') if weeks else '') +
                                          ((' AND site = ' + "'" + site + "'") if site else ''))][0]
        max_week_result = [row for row in
                           db.session.execute('SELECT MAX(week) max_week' +
                                              ' FROM ' + sport + '_lineups' +
                                              ' WHERE slate = ' + "'" + slate + "'" +
                                              ' AND COALESCE(qb_actual, rb_actual, wr_actual, te_actual,' +
                                              ' flex_actual, dst_actual, NULL) IS NOT NULL')][0][0]
    return {'data': data_result, 'max_week': max_week_result}


def get_projected_lineup(sport, slate, site, week, db):
    if not db:
        return {}
    if slate == 'thurs':
        lineup = [row for row in
                  db.session.execute('SELECT projected_lineup' +
                                     ' FROM ' + sport + '_mvp_lineups' +
                                     ' WHERE slate = ' + "'" + slate + "'" +
                                     ' AND week = ' + str(week) +
                                     ' AND site = ' + "'" + site + "'")][0]
    else:
        lineup = [row for row in
                  db.session.execute('SELECT projected_lineup' +
                                     ' FROM ' + sport + '_lineups' +
                                     ' WHERE slate = ' + "'" + slate + "'" +
                                     ' AND week = ' + str(week) +
                                     ' AND site = ' + "'" + site + "'")][0]
    return lineup.split(',')


def aggregate_reporting_data(query_results, slate):
    data = query_results.get('data')
    total_expected = round(sum([data[i] for i in range(len(data)) if i % 3 == 0 and data[i]]), 2)
    total_actual = round(sum([data[i] for i in range(len(data)) if i % 3 == 1 and data[i]]), 2)
    total_optimal = round(sum([data[i] for i in range(len(data)) if i % 3 == 2 and data[i]]), 2)
    totals = [
        {
            'position': 'Total',
            'expected': total_expected,
            'actual': total_actual,
            'optimal': total_optimal,
            'expected_v_actual': 0 if total_actual == 0 else (total_expected - total_actual) / total_actual,
            'actual_v_optimal': 0 if total_optimal == 0 else (total_actual - total_optimal) / total_optimal,
            'expected_v_optimal': 0 if total_optimal == 0 else (total_expected - total_optimal) / total_optimal
        }
    ]
    positions = ['MVP (1.5x Points)', 'FLEX'] if slate == 'thurs' else ['QB', 'RB', 'WR', 'TE', 'FLEX', 'D/ST']
    aggregated_data = {
        'data': [
            {
                'position': positions[i],
                'expected': data[3 * i],
                'actual': data[3 * i + 1],
                'optimal': data[3 * i + 2],
                'expected_v_actual': 0 if data[3 * i + 1] == 0 else (data[3 * i + 0] - data[3 * i + 1]) / data[3 * i + 1],
                'actual_v_optimal': 0 if data[3 * i + 2] == 0 else (data[3 * i + 1] - data[3 * i + 2]) / data[3 * i + 2],
                'expected_v_optimal': 0 if data[3 * i + 2] == 0 else (data[3 * i + 0] - data[3 * i + 2]) / data[3 * i + 2]
            } for i in range(6)
        ] + totals,
        'maxWeek': query_results.get('max_week')
    }
    return aggregated_data
