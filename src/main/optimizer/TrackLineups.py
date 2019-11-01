from .Optimizer import *
from .MVPOptimizer import *
from src.main.optimizer.GetDFSReportingData import *
from src.main.optimizer.DfsConfigs import *


def save_to_database(sport, week, site, slate, row, db):
    if slate == 'Thurs':
        table = sport + '_mvp_lineups'
        columns = ['week', 'site', 'slate', 'projected_lineup', 'optimal_lineup', 'mvp_expected', 'mvp_actual',
                   'mvp_optimal', 'flex_expected', 'flex_actual', 'flex_optimal']
    else:
        table = sport + '_lineups'
        columns = ['week', 'site', 'slate', 'projected_lineup', 'optimal_lineup', 'qb_expected', 'qb_actual',
                   'qb_optimal', 'rb_expected', 'rb_actual', 'rb_optimal', 'wr_expected', 'wr_actual', 'wr_optimal',
                   'te_expected', 'te_actual', 'te_optimal', 'flex_expected', 'flex_actual', 'flex_optimal',
                   'dst_expected', 'dst_actual', 'dst_optimal']
    result_query = 'SELECT * FROM ' + table + \
                   ' WHERE week = ' + str(week) + ' AND site = ' + "'" + site + "'" + \
                   ' AND slate = ' + "'" + slate + "'" + ' ORDER BY week, site'
    result = db.session.execute(result_query) if db else []
    existing_rows = [row for row in result]
    if existing_rows:
        col_list = [columns[i] + ' = ' + (("'" + str(row[i]) + "'") if i in (1, 2, 3, 4) else str(row[i])) + ', '
                    for i in range(len(columns))]
        update_string = ''.join(col_list) + 'updated = CURRENT_TIMESTAMP'
        update_query = 'UPDATE ' + table + ' SET ' + update_string + \
                       ' WHERE week = ' + str(week) + \
                       ' AND site = ' + "'" + site + "'" + ' AND slate = ' + "'" + slate + "'"
    else:
        update_query = 'INSERT INTO ' + table + \
                       ' VALUES ' + str(row)[:-1].replace("'NULL'", 'NULL') + ', CURRENT_TIMESTAMP)'
    if db:
        db.session.execute(update_query)
        db.session.commit()


def ingest_actual_optimal_data(lineup_matrix, display_matrix, sport, site, slate, proj_dict,
                               pos_dict, salary_dict, scores_dict, proj_lineup, cap, week, db):
    if slate == 'Thurs':
        projected_lineup = proj_lineup if proj_lineup else optimize_mvp(site, [], proj_dict, salary_dict, len(display_matrix), cap).get('lineup')
        optimal_lineup = optimize_mvp(site, [], scores_dict, salary_dict, len(display_matrix), cap).get('lineup')
    else:
        projected_lineup = proj_lineup if proj_lineup else optimize(lineup_matrix, [], [], proj_dict, pos_dict, salary_dict, cap).get('lineup')
        optimal_lineup = optimize(lineup_matrix, [], [], scores_dict, pos_dict, salary_dict, cap).get('lineup')
    new_row = get_reporting_data(projected_lineup, optimal_lineup, display_matrix, week, site, slate, proj_dict,
                                 scores_dict)
    if db:
        save_to_database(sport, week, site, slate, new_row, db)
    else:
        print(new_row)


def aggregate_historical_data(sport, site, slate, db):
    lineup_type = 'mvp' if slate == 'Thurs' else 'standard'
    lineup_matrix = dfs_configs.get(site).get(sport).get(lineup_type).get('lineup_matrix')
    display_matrix = dfs_configs.get(site).get(sport).get(lineup_type).get('display_matrix')
    cap = dfs_configs.get(site).get(sport).get(lineup_type).get('salary_cap')
    if db:
        for week in get_reporting_weeks(sport, slate, site, db):
            historical_dict = get_historical_dfs_info(week, site)
            prev_projections = get_hist_nfl_projections(slate, week)
            prev_pos_dict = {player_dict.get('name'): site_projection.get('position')
                             for player_dict in prev_projections
                             for site_projection in player_dict.get('projection')
                             if site_projection.get('position')
                             if site_projection.get('siteId') == (1 if site == 'dk' else 2)}
            prev_proj_dict = {player_dict.get('name'): float(site_projection.get('points'))
                              for player_dict in prev_projections
                              for site_projection in player_dict.get('projection')
                              if site_projection.get('siteId') == (1 if site == 'dk' else 2)}
            prev_scores_dict = {player: item.get('points')
                                for player, item in historical_dict.items()}
            prev_salary_dict = {player: item.get('salary')
                                for player, item in historical_dict.items()}
            proj_lineup = get_projected_lineup(sport, slate, site, week, db)
            ingest_actual_optimal_data(lineup_matrix, display_matrix, sport, site, slate, prev_proj_dict, prev_pos_dict,
                                       prev_salary_dict, prev_scores_dict, proj_lineup, cap, week, db)
