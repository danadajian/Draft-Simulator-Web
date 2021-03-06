import unittest
from src.main.optimizer.Optimizer import *


class TestOptimizer(unittest.TestCase):
    def test_ignore_player(self):
        black_list = ['QB3']
        pools = [['QB2', 'QB3', 'QB1'], ['RB2', 'RB3', 'RB1'], ['QB3', 'WR1', 'WR3']]
        new_pools = remove_ignored_players(pools, black_list)
        self.assertEqual([['QB2', 'QB1'], ['RB2', 'RB3', 'RB1'], ['WR1', 'WR3']], new_pools)

    def test_ignore_multiple_players(self):
        black_list = ['QB3', 'WR1']
        pools = [['QB2', 'QB3', 'QB1'], ['RB2', 'RB3', 'RB1'], ['QB3', 'WR1', 'WR3']]
        new_pools = remove_ignored_players(pools, black_list)
        self.assertEqual([['QB2', 'QB1'], ['RB2', 'RB3', 'RB1'], ['WR3']], new_pools)

    def test_ignore_no_players(self):
        black_list = []
        pools = [['QB2', 'QB3', 'QB1'], ['RB2', 'RB3', 'RB1'], ['WR1', 'WR3']]
        new_pools = remove_ignored_players(pools, black_list)
        self.assertEqual(pools, new_pools)

    def test_get_player_pools(self):
        matrix = ['QB', 'RB']
        proj_pts = {'Eli': 20, 'Gurley': 25, 'Saquon': 69}
        pos_dict = {'Eli': 'QB', 'Gurley': 'RB', 'Saquon': 'RB'}
        salary_idct = {'Eli': 5000, 'Gurley': 8000, 'Saquon': 9000}
        self.assertEqual([['Eli'], ['Saquon', 'Gurley']], get_player_pools(matrix, [], proj_pts, pos_dict, salary_idct))

    def test_get_best_lineup(self):
        self.assertEqual(['Eli', 'Saquon'], get_best_lineup([['Eli'], ['Eli', 'Saquon', 'Gurley']], []))

    def test_get_best_lineup_white_list(self):
        self.assertEqual(['Eli', 'Gurley'], get_best_lineup([['Eli'], ['Eli', 'Saquon', 'Gurley']], ['Gurley']))

    def test_get_best_lineup_white_list_different_ordering(self):
        self.assertEqual(['Saquon', 'Eli'], get_best_lineup([['Eli', 'Saquon'], ['Eli', 'Saquon', 'Gurley']],
                                                            ['Saquon', 'Eli']))

    def test_get_best_lineup_white_list_exhaust_pools(self):
        self.assertEqual(None, get_best_lineup([['Eli'], ['Saquon', 'Gurley'], ['Gurley']], ['Gurley']))

    def test_higher_proj_pts(self):
        position_matrix = {'QB': [1], 'RB': [1]}
        proj_dict = {'Eli': 20, 'Gurley': 25, 'Saquon': 69}
        pos_dict = {'Eli': 'QB', 'Gurley': 'RB', 'Saquon': 'RB'}
        salary_dict = {'Eli': 5000, 'Gurley': 6500, 'Saquon': 6500}
        salary_cap = 12000
        self.assertEqual({'lineup': ['Eli', 'Saquon'], 'max_pts': 89, 'total_pts': 89, 'total_salary': 11500},
                         optimize(position_matrix, [], [], proj_dict, pos_dict, salary_dict, salary_cap))

    def test_salary_cap(self):
        position_matrix = ['QB', 'RB']
        proj_dict = {'Eli': 20, 'Gurley': 25, 'Saquon': 69}
        pos_dict = {'Eli': 'QB', 'Gurley': 'RB', 'Saquon': 'RB'}
        salary_dict = {'Eli': 5000, 'Gurley': 6500, 'Saquon': 7001}
        salary_cap = 12000
        self.assertEqual({'lineup': ['Eli', 'Gurley'], 'max_pts': 89, 'total_pts': 45, 'total_salary': 11500},
                         optimize(position_matrix, [], [], proj_dict, pos_dict, salary_dict, salary_cap))

    def test_mult_of_eac_pos(self):
        position_matrix = ['QB', 'QB', 'RB', 'RB', 'WR', 'WR', 'WR']
        proj_dict = {'QB1': 1, 'QB2': 2, 'QB3': 3, 'RB1': 1, 'RB2': 2, 'RB3': 3, 'RB4': 4, 'WR1': 1, 'WR2': 2, 'WR3': 3,
                     'WR4': 4, 'WR5': 5}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        salary_dict = {'QB1': 100, 'QB2': 200, 'QB3': 300, 'RB1': 100, 'RB2': 200, 'RB3': 300, 'RB4': 400, 'WR1': 100,
                       'WR2': 200, 'WR3': 300, 'WR4': 400, 'WR5': 500}
        salary_cap = 12000
        result = optimize(position_matrix, [], [], proj_dict, pos_dict, salary_dict, salary_cap)
        self.assertEqual({'QB2', 'QB3', 'RB3', 'RB4', 'WR3', 'WR4', 'WR5'}, set(result.get('lineup')))

    def test_mult_of_eac_pos_2(self):
        position_matrix = ['QB', 'QB', 'RB', 'RB', 'WR', 'WR', 'WR']
        proj_dict = {'QB1': 3, 'QB2': 2, 'QB3': 1, 'RB1': 4, 'RB2': 3, 'RB3': 2, 'RB4': 1, 'WR1': 5, 'WR2': 4, 'WR3': 3,
                     'WR4': 2, 'WR5': 1}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        salary_dict = {'QB1': 300, 'QB2': 200, 'QB3': 100, 'RB1': 400, 'RB2': 300, 'RB3': 200, 'RB4': 100, 'WR1': 500,
                       'WR2': 400, 'WR3': 300, 'WR4': 200, 'WR5': 100}
        salary_cap = 12000
        result = optimize(position_matrix, [], [], proj_dict, pos_dict, salary_dict, salary_cap)
        self.assertEqual({'QB1', 'QB2', 'RB1', 'RB2', 'WR1', 'WR2', 'WR3'}, set(result.get('lineup')))

    def test_mult_of_eac_pos_rand(self):
        position_matrix = ['QB', 'QB', 'RB', 'RB', 'WR', 'WR', 'WR']
        proj_dict = {'QB1': 5, 'QB2': 2, 'QB3': 6, 'RB1': 2, 'RB2': 7, 'RB3': 1, 'RB4': 6, 'WR1': 3, 'WR2': 5, 'WR3': 7,
                     'WR4': 2, 'WR5': 3}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        salary_dict = {'QB1': 600, 'QB2': 200, 'QB3': 400, 'RB1': 300, 'RB2': 100, 'RB3': 800, 'RB4': 400, 'WR1': 600,
                       'WR2': 400, 'WR3': 300, 'WR4': 200, 'WR5': 500}
        salary_cap = 2700
        result = optimize(position_matrix, [], [], proj_dict, pos_dict, salary_dict, salary_cap)
        self.assertEqual({'QB2', 'QB3', 'RB2', 'RB4', 'WR1', 'WR2', 'WR3'}, set(result.get('lineup')))

    def test_mult_of_eac_pos_and_config(self):
        position_matrix = ['QB', 'RB', 'RB', 'WR', 'WR', 'RB WR']
        proj_dict = {'QB1': 5, 'QB2': 2, 'QB3': 6, 'RB1': 2, 'RB2': 7, 'RB3': 1, 'RB4': 6, 'WR1': 3, 'WR2': 5, 'WR3': 7,
                     'WR4': 2, 'WR5': 3}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        salary_dict = {'QB1': 600, 'QB2': 200, 'QB3': 400, 'RB1': 300, 'RB2': 100, 'RB3': 800, 'RB4': 400, 'WR1': 600,
                       'WR2': 400, 'WR3': 300, 'WR4': 200, 'WR5': 500}
        salary_cap = 4000
        result = optimize(position_matrix, [], [], proj_dict, pos_dict, salary_dict, salary_cap)
        self.assertEqual({'QB3', 'RB2', 'RB4', 'WR1', 'WR2', 'WR3'}, set(result.get('lineup')))

    def test_salary_cap_too_low(self):
        position_matrix = ['QB', 'RB', 'RB', 'WR', 'WR', 'RB WR']
        proj_dict = {'QB1': 5, 'QB2': 2, 'QB3': 6, 'RB1': 2, 'RB2': 7, 'RB3': 1, 'RB4': 6, 'WR1': 3, 'WR2': 5,
                     'WR3': 7, 'WR4': 2, 'WR5': 3}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        salary_dict = {'QB1': 600, 'QB2': 200, 'QB3': 400, 'RB1': 300, 'RB2': 100, 'RB3': 800, 'RB4': 400,
                       'WR1': 600, 'WR2': 400, 'WR3': 300, 'WR4': 200, 'WR5': 500}
        salary_cap = 100
        result = optimize(position_matrix, [], [], proj_dict, pos_dict, salary_dict, salary_cap)
        self.assertEqual([], result.get('lineup'))

    def test_not_enough_players(self):
        position_matrix = ['QB', 'RB', 'RB', 'WR', 'WR', 'RB WR']
        proj_dict = {'QB1': 5, 'RB1': 2, 'RB3': 1, 'RB4': 6, 'WR1': 3, 'WR2': 5}
        pos_dict = {'QB1': 'QB', 'RB1': 'RB', 'RB3': 'RB', 'RB4': 'RB', 'WR1': 'WR', 'WR2': 'WR'}
        salary_dict = {'QB1': 600, 'RB1': 300, 'RB3': 800, 'RB4': 400, 'WR1': 600, 'WR2': 400}
        salary_cap = 3000
        result = optimize(position_matrix, [], [], proj_dict, pos_dict, salary_dict, salary_cap)
        self.assertEqual([], result.get('lineup'))

    def test_black_list_equivalent_to_players_missing(self):
        position_matrix = ['QB', 'RB', 'RB', 'WR', 'WR', 'RB WR']
        proj_dict = {'QB1': 5, 'QB2': 2, 'QB3': 6, 'RB1': 2, 'RB2': 7, 'RB3': 1, 'RB4': 6, 'WR1': 3, 'WR2': 5, 'WR3': 7,
                     'WR4': 2, 'WR5': 3}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        salary_dict = {'QB1': 600, 'QB2': 200, 'QB3': 400, 'RB1': 300, 'RB2': 100, 'RB3': 800, 'RB4': 400, 'WR1': 600,
                       'WR2': 400, 'WR3': 300, 'WR4': 200, 'WR5': 500}
        salary_cap = 4000
        black_list = ['QB3', 'RB2']
        result = optimize(position_matrix, [], black_list, proj_dict, pos_dict, salary_dict, salary_cap)
        missing_proj_dict = {'QB1': 5, 'QB2': 2, 'RB1': 2, 'RB3': 1, 'RB4': 6, 'WR1': 3, 'WR2': 5, 'WR3': 7, 'WR4': 2,
                             'WR5': 3}
        missing_pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'RB1': 'RB', 'RB3': 'RB', 'RB4': 'RB', 'WR1': 'WR', 'WR2': 'WR',
                            'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        missing_salary_dict = {'QB1': 600, 'QB2': 200, 'RB1': 300, 'RB3': 800, 'RB4': 400, 'WR1': 600, 'WR2': 400,
                               'WR3': 300, 'WR4': 200, 'WR5': 500}
        missing_result = optimize(position_matrix, [], [], missing_proj_dict, missing_pos_dict, missing_salary_dict,
                                  salary_cap)
        self.assertEqual({'QB1', 'RB1', 'RB4', 'WR1', 'WR2', 'WR3'}, set(result.get('lineup')))
        self.assertEqual(set(missing_result.get('lineup')), set(result.get('lineup')))

    def test_white_list_equivalent_to_players_missing(self):
        position_matrix = ['QB', 'RB', 'RB', 'WR', 'WR', 'RB WR']
        proj_dict = {'QB1': 5, 'QB2': 2, 'QB3': 6, 'RB1': 2, 'RB2': 7, 'RB3': 1, 'RB4': 6, 'WR1': 3, 'WR2': 5, 'WR3': 7,
                     'WR4': 2, 'WR5': 3}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        salary_dict = {'QB1': 600, 'QB2': 200, 'QB3': 400, 'RB1': 300, 'RB2': 100, 'RB3': 800, 'RB4': 400, 'WR1': 600,
                       'WR2': 400, 'WR3': 300, 'WR4': 200, 'WR5': 500}
        salary_cap = 4000
        white_list = ['QB2', 'RB3']
        result = optimize(position_matrix, white_list, [], proj_dict, pos_dict, salary_dict, salary_cap)
        missing_position_matrix = ['RB', 'WR', 'WR', 'RB WR']
        missing_proj_dict = {'QB1': 5, 'QB3': 6, 'RB1': 2, 'RB2': 7, 'RB4': 6, 'WR1': 3, 'WR2': 5, 'WR3': 7, 'WR4': 2,
                             'WR5': 3}
        missing_pos_dict = {'QB1': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB4': 'RB', 'WR1': 'WR', 'WR2': 'WR',
                            'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        missing_salary_dict = {'QB1': 600, 'QB3': 400, 'RB1': 300, 'RB2': 100, 'RB4': 400, 'WR1': 600, 'WR2': 400,
                               'WR3': 300, 'WR4': 200, 'WR5': 500}
        missing_salary_cap = 4000 - salary_dict.get('QB2') - salary_dict.get('RB3')
        missing_result = optimize(missing_position_matrix, white_list, [], missing_proj_dict, missing_pos_dict,
                                  missing_salary_dict, missing_salary_cap)
        self.assertEqual({'QB2', 'RB3', 'RB2', 'RB4', 'WR2', 'WR3'}, set(result.get('lineup')))
        self.assertEqual(set(white_list + missing_result.get('lineup')), set(result.get('lineup')))
