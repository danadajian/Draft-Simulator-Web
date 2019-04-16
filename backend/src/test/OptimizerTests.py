import unittest
from backend.src.main.Optimizer import *


class OptimizerTests(unittest.TestCase):
    def test_higher_proj_pts(self):
        position_matrix = {'QB': [1], 'RB': [1]}
        proj_pts = {'Eli': 20, 'Gurley': 25, 'Saquon': 69}
        pos_dict = {'Eli': 'QB', 'Gurley': 'RB', 'Saquon': 'RB'}
        salary_dict = {'Eli': 5000, 'Gurley': 6500, 'Saquon': 6500}
        salary_cap = 12000
        self.assertTrue(optimize(position_matrix, proj_pts, pos_dict, salary_dict, salary_cap) == ['Eli', 'Saquon'])

    def test_salary_cap(self):
        lineup_matrix = ['QB', 'RB']
        proj_pts = {'Eli': 20, 'Gurley': 25, 'Saquon': 69}
        pos_dict = {'Eli': 'QB', 'Gurley': 'RB', 'Saquon': 'RB'}
        salary_dict = {'Eli': 5000, 'Gurley': 6500, 'Saquon': 7001}
        salary_cap = 12000
        self.assertEqual(['Eli', 'Gurley'], optimize(lineup_matrix, proj_pts, pos_dict, salary_dict, salary_cap))

    def test_mult_of_eac_pos(self):
        position_matrix = ['QB', 'QB', 'RB', 'RB', 'WR', 'WR', 'WR']
        proj_pts = {'QB1': 1, 'QB2': 2, 'QB3': 3, 'RB1': 1, 'RB2': 2, 'RB3': 3, 'RB4': 4, 'WR1': 1, 'WR2': 2, 'WR3': 3,
                    'WR4': 4, 'WR5': 5}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        salary_dict = {'QB1': 100, 'QB2': 200, 'QB3': 300, 'RB1': 100, 'RB2': 200, 'RB3': 300, 'RB4': 400, 'WR1': 100,
                       'WR2': 200, 'WR3': 300, 'WR4': 400, 'WR5': 50000}
        salary_cap = 12000
        self.assertEqual(['QB2', 'QB3', 'RB3', 'RB4', 'WR2', 'WR3', 'WR4'],
                         optimize(position_matrix, proj_pts, pos_dict, salary_dict, salary_cap))

    def test_mult_of_eac_pos_2(self):
        position_matrix = ['QB', 'QB', 'RB', 'RB', 'WR', 'WR', 'WR']
        proj_pts = {'QB1': 3, 'QB2': 2, 'QB3': 1, 'RB1': 4, 'RB2': 3, 'RB3': 2, 'RB4': 1, 'WR1': 5, 'WR2': 4, 'WR3': 3,
                    'WR4': 2, 'WR5': 1}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        salary_dict = {'QB1': 300, 'QB2': 200, 'QB3': 100, 'RB1': 400, 'RB2': 300, 'RB3': 200, 'RB4': 100, 'WR1': 500,
                       'WR2': 400, 'WR3': 300, 'WR4': 200, 'WR5': 100}
        salary_cap = 12000
        self.assertEqual(['QB1', 'QB2', 'RB1', 'RB2', 'WR1', 'WR2', 'WR3'],
                         optimize(position_matrix, proj_pts, pos_dict, salary_dict, salary_cap))

    def test_mult_of_eac_pos_rand(self):
        position_matrix = ['QB', 'QB', 'RB', 'RB', 'WR', 'WR', 'WR']
        proj_pts = {'QB1': 5, 'QB2': 2, 'QB3': 6, 'RB1': 2, 'RB2': 7, 'RB3': 1, 'RB4': 6, 'WR1': 3, 'WR2': 5, 'WR3': 7,
                    'WR4': 2, 'WR5': 3}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        salary_dict = {'QB1': 600, 'QB2': 200, 'QB3': 400, 'RB1': 300, 'RB2': 100, 'RB3': 800, 'RB4': 400, 'WR1': 600,
                       'WR2': 400, 'WR3': 300, 'WR4': 200, 'WR5': 500}
        salary_cap = 2700
        self.assertEqual(['QB1', 'QB3', 'RB2', 'RB4', 'WR2', 'WR3', 'WR5'],
                         optimize(position_matrix, proj_pts, pos_dict, salary_dict, salary_cap))

    def test_mult_of_eac_pos_and_config(self):
        position_matrix = ['QB', 'RB', 'RB', 'WR', 'WR', 'RB WR']
        proj_pts = {'QB1': 5, 'QB2': 2, 'QB3': 6, 'RB1': 2, 'RB2': 7, 'RB3': 1, 'RB4': 6, 'WR1': 3, 'WR2': 5, 'WR3': 7,
                    'WR4': 2, 'WR5': 3}
        pos_dict = {'QB1': 'QB', 'QB2': 'QB', 'QB3': 'QB', 'RB1': 'RB', 'RB2': 'RB', 'RB3': 'RB', 'RB4': 'RB',
                    'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'WR4': 'WR', 'WR5': 'WR'}
        salary_dict = {'QB1': 600, 'QB2': 200, 'QB3': 400, 'RB1': 300, 'RB2': 100, 'RB3': 800, 'RB4': 400, 'WR1': 600,
                       'WR2': 400, 'WR3': 300, 'WR4': 200, 'WR5': 500}
        salary_cap = 4000
        self.assertEqual(['QB3', 'RB2', 'RB4', 'WR2', 'WR3', 'WR4'],
                         optimize(position_matrix, proj_pts, pos_dict, salary_dict, salary_cap))


if __name__ == '__main__':
    unittest.main()
