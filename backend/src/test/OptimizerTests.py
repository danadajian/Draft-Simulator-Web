import unittest
from backend.src.main.Optimizer import *


class OptimizerTests(unittest.TestCase):
    def test_optimizer(self):
        position_matrix = {'QB': [1], 'RB': [1]}
        proj_pts = {'Eli': 20, 'Gurley': 25, 'Saquon': 69}
        pos_dict = {'Eli': 'QB', 'Gurley': 'RB', 'Saquon': 'RB'}
        salary_dict = {'Eli': 5000, 'Gurley': 6500, 'Saquon': 6500}
        salary_cap = 12000
        self.assertTrue(optimize(position_matrix, proj_pts, pos_dict, salary_dict, salary_cap) == ['Eli', 'Saquon'])


if __name__ == '__main__':
    unittest.main()