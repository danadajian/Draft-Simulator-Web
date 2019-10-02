from .Optimizer import *
from .MVPOptimizer import *
from src.main.optimizer.GetDFSReportingData import *


def save_new_lineups(sport, week, site, slate, row, db):
    if slate == 'thurs':
        table = sport + '_mvp_lineups'
        columns = ['week', 'site', 'slate', 'projected_lineup', 'optimal_lineup', 'mvp_expected', 'mvp_actual',
                   'mvp_optimal', 'flex_expected', 'flex_actual', 'flex_optimal']
    else:
        table = sport + '_lineups'
        columns = ['week', 'site', 'slate', 'projected_lineup', 'optimal_lineup', 'qb_expected', 'qb_actual',
                   'qb_optimal', 'rb_expected', 'rb_actual', 'rb_optimal', 'wr_expected', 'wr_actual', 'wr_optimal',
                   'te_expected', 'te_actual', 'te_optimal', 'flex_expected', 'flex_actual', 'flex_optimal',
                   'dst_expected', 'dst_actual', 'dst_optimal']
    result = db.session.execute('SELECT * FROM ' + table +
                                ' WHERE week = ' + str(week) +
                                ' AND site = ' + "'" + site + "'" +
                                ' AND slate = ' + "'" + slate + "'" +
                                ' ORDER BY week, site')
    existing_rows = [row for row in result]
    if existing_rows:
        col_list = [columns[i] + ' = ' + (("'" + str(row[i]) + "'") if i in (1, 2, 3, 4) else str(row[i])) + ', '
                    for i in range(len(columns))]
        update_string = ''.join(col_list) + 'updated = CURRENT_TIMESTAMP'
        db.session.execute('UPDATE ' + table +
                           ' SET ' + update_string +
                           ' WHERE week = ' + str(week) +
                           ' AND site = ' + "'" + site + "'" +
                           ' AND slate = ' + "'" + slate + "'")
    else:
        db.session.execute('INSERT INTO ' + table + ' VALUES ' +
                           str(row)[:-1].replace("'NULL'", 'NULL') + ', CURRENT_TIMESTAMP)')
    db.session.commit()


def ingest_actual_optimal_data(lineup_matrix, display_matrix, sport, site, slate, proj_dict,
                               pos_dict, salary_dict, cap, projected_lineup, db):
    week = get_all_events()[0].get('week')
    scores_dict = {player: item.get('points') for player, item in get_historical_dfs_info(week, site).items()}
    if slate == 'thurs':
        optimal_lineup = optimize_mvp(site, [], scores_dict, salary_dict, len(display_matrix),
                                      cap).get('lineup')
    else:
        optimal_lineup = optimize(lineup_matrix, [], [], scores_dict, pos_dict, salary_dict,
                                  cap).get('lineup')
    new_row = get_reporting_data(projected_lineup, optimal_lineup, display_matrix, week, site, slate, proj_dict,
                                 scores_dict)
    if db:
        save_new_lineups(sport, week, site, slate, new_row, db)
    else:
        print(new_row)
