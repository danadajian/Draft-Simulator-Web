import unittest
from backend.src.main.PositionCheck import *


class PositionCheckTests(unittest.TestCase):
    def test_position_count(self):
        test_list = ['Saquon Barkley', 'Odell Beckham Jr', 'Julio Jones', 'Travis Kelce', 'Zach Ertz', 'George Kittle',
                     'Packers D/ST', 'Ravens D/ST', 'Jaguars D/ST', 'Seahawks D/ST', 'Justin Tucker', 'Robbie Gould',
                     'Harrison Butker', 'Matt Prater', 'Matt Bryant']
        position_list = ['QB', 'RB', 'WR', 'TE', 'DST', 'K']
        expected_counts = []
        actual_counts = []
        for pos in position_list:
            n = position_list.index(pos)
            expected_count = n
            actual_count = position_count(test_list, pos)
            expected_counts.append(expected_count)
            actual_counts.append(actual_count)
        self.assertEqual(expected_counts, actual_counts)

    def test_valid_choice(self):
        test_team = ['Saquon Barkley', 'Odell Beckham Jr', 'Julio Jones', 'Travis Kelce', 'Packers D/ST']
        self.assertTrue(valid_choice('Aaron Rodgers', test_team))
        self.assertTrue(valid_choice('Adam Thielen', test_team))
        self.assertFalse(valid_choice('Jaguars D/ST', test_team))
        self.assertFalse(valid_choice(None, test_team))


if __name__ == '__main__':
    unittest.main()
