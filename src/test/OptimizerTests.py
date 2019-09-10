import unittest
from src.main.Optimizer import *


class OptimizerTests(unittest.TestCase):
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
        self.assertEqual([['Eli'], ['Saquon', 'Gurley']], get_player_pools(matrix, [], proj_pts, pos_dict))

    def test_get_best_lineup(self):
        self.assertEqual(['Eli', 'Saquon'], get_best_lineup([['Eli'], ['Eli', 'Saquon', 'Gurley']]))

    def test_higher_proj_pts(self):
        position_matrix = {'QB': [1], 'RB': [1]}
        proj_dict = {'Eli': 20, 'Gurley': 25, 'Saquon': 69}
        pos_dict = {'Eli': 'QB', 'Gurley': 'RB', 'Saquon': 'RB'}
        pools = get_player_pools(position_matrix, [], proj_dict, pos_dict)
        best_lineup = get_best_lineup(pools)
        salary_dict = {'Eli': 5000, 'Gurley': 6500, 'Saquon': 6500}
        salary_cap = 12000
        self.assertEqual(['Eli', 'Saquon'], optimize(best_lineup, pools, proj_dict, salary_dict, salary_cap))

    def test_salary_cap(self):
        position_matrix = ['QB', 'RB']
        proj_dict = {'Eli': 20, 'Gurley': 25, 'Saquon': 69}
        pos_dict = {'Eli': 'QB', 'Gurley': 'RB', 'Saquon': 'RB'}
        pools = get_player_pools(position_matrix, [], proj_dict, pos_dict)
        best_lineup = get_best_lineup(pools)
        salary_dict = {'Eli': 5000, 'Gurley': 6500, 'Saquon': 7001}
        salary_cap = 12000
        self.assertEqual(['Eli', 'Gurley'], optimize(best_lineup, pools, proj_dict, salary_dict, salary_cap))

    def test_mult_of_eac_pos(self):
        position_matrix = ['QB', 'QB', 'RB', 'RB', 'WR', 'WR', 'WR']
        proj_dict = {'QB1': 1, 'QB2': 2, 'QB3': 3, 'RB1': 1, 'RB2': 2, 'RB3': 3, 'RB4': 4, 'WR1': 1, 'WR2': 2, 'WR3': 3,
                    'WR4': 4, 'WR5': 5}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        pools = get_player_pools(position_matrix, [], proj_dict, pos_dict)
        best_lineup = get_best_lineup(pools)
        salary_dict = {'QB1': 100, 'QB2': 200, 'QB3': 300, 'RB1': 100, 'RB2': 200, 'RB3': 300, 'RB4': 400, 'WR1': 100,
                       'WR2': 200, 'WR3': 300, 'WR4': 400, 'WR5': 500}
        salary_cap = 12000
        result = set(optimize(best_lineup, pools, proj_dict, salary_dict, salary_cap))
        self.assertEqual({'QB2', 'QB3', 'RB3', 'RB4', 'WR3', 'WR4', 'WR5'}, result)

    def test_mult_of_eac_pos_2(self):
        position_matrix = ['QB', 'QB', 'RB', 'RB', 'WR', 'WR', 'WR']
        proj_dict = {'QB1': 3, 'QB2': 2, 'QB3': 1, 'RB1': 4, 'RB2': 3, 'RB3': 2, 'RB4': 1, 'WR1': 5, 'WR2': 4, 'WR3': 3,
                    'WR4': 2, 'WR5': 1}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        pools = get_player_pools(position_matrix, [], proj_dict, pos_dict)
        best_lineup = get_best_lineup(pools)
        salary_dict = {'QB1': 300, 'QB2': 200, 'QB3': 100, 'RB1': 400, 'RB2': 300, 'RB3': 200, 'RB4': 100, 'WR1': 500,
                       'WR2': 400, 'WR3': 300, 'WR4': 200, 'WR5': 100}
        salary_cap = 12000
        result = set(optimize(best_lineup, pools, proj_dict, salary_dict, salary_cap))
        self.assertEqual({'QB1', 'QB2', 'RB1', 'RB2', 'WR1', 'WR2', 'WR3'}, result)

    def test_mult_of_eac_pos_rand(self):
        position_matrix = ['QB', 'QB', 'RB', 'RB', 'WR', 'WR', 'WR']
        proj_dict = {'QB1': 5, 'QB2': 2, 'QB3': 6, 'RB1': 2, 'RB2': 7, 'RB3': 1, 'RB4': 6, 'WR1': 3, 'WR2': 5, 'WR3': 7,
                    'WR4': 2, 'WR5': 3}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        pools = get_player_pools(position_matrix, [], proj_dict, pos_dict)
        best_lineup = get_best_lineup(pools)
        salary_dict = {'QB1': 600, 'QB2': 200, 'QB3': 400, 'RB1': 300, 'RB2': 100, 'RB3': 800, 'RB4': 400, 'WR1': 600,
                       'WR2': 400, 'WR3': 300, 'WR4': 200, 'WR5': 500}
        salary_cap = 2700
        result = set(optimize(best_lineup, pools, proj_dict, salary_dict, salary_cap))
        self.assertEqual({'QB2', 'QB3', 'RB2', 'RB4', 'WR1', 'WR2', 'WR3'}, result)

    def test_mult_of_eac_pos_and_config(self):
        position_matrix = ['QB', 'RB', 'RB', 'WR', 'WR', 'RB WR']
        proj_dict = {'QB1': 5, 'QB2': 2, 'QB3': 6, 'RB1': 2, 'RB2': 7, 'RB3': 1, 'RB4': 6, 'WR1': 3, 'WR2': 5, 'WR3': 7,
                    'WR4': 2, 'WR5': 3}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        pools = get_player_pools(position_matrix, [], proj_dict, pos_dict)
        best_lineup = get_best_lineup(pools)
        salary_dict = {'QB1': 600, 'QB2': 200, 'QB3': 400, 'RB1': 300, 'RB2': 100, 'RB3': 800, 'RB4': 400, 'WR1': 600,
                       'WR2': 400, 'WR3': 300, 'WR4': 200, 'WR5': 500}
        salary_cap = 4000
        result = set(optimize(best_lineup, pools, proj_dict, salary_dict, salary_cap))
        self.assertEqual({'QB3', 'RB2', 'RB4', 'WR1', 'WR2', 'WR3'}, result)

    def test_salary_cap_too_low(self):
        position_matrix = ['QB', 'RB', 'RB', 'WR', 'WR', 'RB WR']
        proj_dict = {'QB1': 5, 'QB2': 2, 'QB3': 6, 'RB1': 2, 'RB2': 7, 'RB3': 1, 'RB4': 6, 'WR1': 3, 'WR2': 5,
                    'WR3': 7,
                    'WR4': 2, 'WR5': 3}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        pools = get_player_pools(position_matrix, [], proj_dict, pos_dict)
        best_lineup = get_best_lineup(pools)
        salary_dict = {'QB1': 600, 'QB2': 200, 'QB3': 400, 'RB1': 300, 'RB2': 100, 'RB3': 800, 'RB4': 400,
                       'WR1': 600, 'WR2': 400, 'WR3': 300, 'WR4': 200, 'WR5': 500}
        salary_cap = 100
        result = optimize(best_lineup, pools, proj_dict, salary_dict, salary_cap)
        self.assertEqual('Warning: \nToo many players removed. Unable to generate new lineup.', result)

    def test_not_enough_players(self):
        position_matrix = ['QB', 'RB', 'RB', 'WR', 'WR', 'RB WR']
        proj_dict = {'QB1': 5, 'RB1': 2, 'RB3': 1, 'RB4': 6, 'WR1': 3, 'WR2': 5}
        pos_dict = {'QB1': 'QB', 'RB1': 'RB', 'RB3': 'RB', 'RB4': 'RB', 'WR1': 'WR', 'WR2': 'WR'}
        pools = get_player_pools(position_matrix, [], proj_dict, pos_dict)
        best_lineup = get_best_lineup(pools)
        salary_dict = {'QB1': 600, 'RB1': 300, 'RB3': 800, 'RB4': 400, 'WR1': 600, 'WR2': 400}
        salary_cap = 3000
        result = optimize(best_lineup, pools, proj_dict, salary_dict, salary_cap)
        self.assertEqual('Warning: \nToo many players removed. Unable to generate new lineup.', result)


if __name__ == '__main__':
    unittest.main()
