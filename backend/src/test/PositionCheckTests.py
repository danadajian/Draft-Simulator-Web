import unittest
from backend.src.main.PositionCheck import *


class PositionCheckTests(unittest.TestCase):
    def test_position_count(self):
        test_list = ['Saquon Barkley', 'Odell Beckham Jr', 'Julio Jones', 'Travis Kelce', 'Zach Ertz']
        pos_dict = {'Saquon Barkley': 'RB', 'Odell Beckham Jr': 'WR', 'Julio Jones': 'WR', 'Travis Kelce': 'TE'}
        self.assertEqual(2, position_count(test_list, pos_dict, 'WR'))

    def test_valid_choice(self):
        test_team = ['Saquon Barkley', 'Odell Beckham Jr', 'Julio Jones', 'Travis Kelce', 'Jaguars D/ST']
        pos_dict = {'Aaron Rodgers': 'QB', 'Odell Beckham Jr': 'WR', 'Julio Jones': 'WR', 'Adam Thielen': 'WR',
                    'Jaguars D/ST': 'DST', 'Ravens D/ST': 'DST'}
        self.assertTrue(valid_choice('Aaron Rodgers', pos_dict, test_team))
        self.assertTrue(valid_choice('Adam Thielen', pos_dict, test_team))
        self.assertFalse(valid_choice('Ravens D/ST', pos_dict, test_team))
        self.assertFalse(valid_choice(None, pos_dict, test_team))

    def test_order_team(self):
        team = ['Saquon Barkley', 'Odell Beckham Jr', 'Greg Zuerlein', 'Julio Jones', 'Travis Kelce', 'Packers D/ST',
                'James Conner', 'James White', 'Evan Engram', 'Sterling Shepard', 'Aaron Rodgers', 'Eli Manning',
                'Marshawn Lynch', 'Jordan Howard', 'Alshon Jeffery', 'Jamison Crowder']
        pos_dict = {'Saquon Barkley': 'RB', 'Odell Beckham Jr': 'WR', 'Greg Zuerlein': 'K', 'Julio Jones': 'WR',
                    'Travis Kelce': 'TE', 'Packers D/ST': 'DST', 'James Conner': 'RB', 'James White': 'RB',
                    'Evan Engram': 'TE', 'Sterling Shepard': 'WR', 'Aaron Rodgers': 'QB', 'Eli Manning': 'QB',
                    'Marshawn Lynch': 'RB', 'Jordan Howard': 'RB', 'Alshon Jeffery': 'WR', 'Jamison Crowder': 'WR'}
        freq_dict = dict(zip(team, [i for i in range(len(team))]))
        self.assertEqual('[{"Position": "QB", "Player": "Aaron Rodgers", "DraftFreq": "10%"}, '
                         '{"Position": "RB", "Player": "Saquon Barkley", "DraftFreq": "0%"}, '
                         '{"Position": "RB", "Player": "James Conner", "DraftFreq": "6%"}, '
                         '{"Position": "WR", "Player": "Odell Beckham Jr", "DraftFreq": "1%"}, '
                         '{"Position": "WR", "Player": "Julio Jones", "DraftFreq": "3%"}, '
                         '{"Position": "TE", "Player": "Travis Kelce", "DraftFreq": "4%"}, '
                         '{"Position": "FLEX", "Player": "James White", "DraftFreq": "7%"}, '
                         '{"Position": "DST", "Player": "Packers D/ST", "DraftFreq": "5%"}, '
                         '{"Position": "K", "Player": "Greg Zuerlein", "DraftFreq": "2%"}, '
                         '{"Position": "BE", "Player": "Evan Engram", "DraftFreq": "8%"}, '
                         '{"Position": "BE", "Player": "Sterling Shepard", "DraftFreq": "9%"}, '
                         '{"Position": "BE", "Player": "Eli Manning", "DraftFreq": "11%"}, '
                         '{"Position": "BE", "Player": "Marshawn Lynch", "DraftFreq": "12%"}, '
                         '{"Position": "BE", "Player": "Jordan Howard", "DraftFreq": "13%"}, '
                         '{"Position": "BE", "Player": "Alshon Jeffery", "DraftFreq": "14%"}, '
                         '{"Position": "BE", "Player": "Jamison Crowder", "DraftFreq": "15%"}]',
                         order_team(team, freq_dict, pos_dict))

    def test_order_short_team(self):
        team = ['Saquon Barkley', 'Odell Beckham Jr', 'Greg Zuerlein', 'Julio Jones', 'Travis Kelce', 'Packers D/ST',
                'James Conner', 'James White', 'Evan Engram', 'Sterling Shepard', 'Aaron Rodgers', 'Eli Manning',
                'Marshawn Lynch', 'Jordan Howard']
        pos_dict = {'Saquon Barkley': 'RB', 'Odell Beckham Jr': 'WR', 'Greg Zuerlein': 'K', 'Julio Jones': 'WR',
                    'Travis Kelce': 'TE', 'Packers D/ST': 'DST', 'James Conner': 'RB', 'James White': 'RB',
                    'Evan Engram': 'TE', 'Sterling Shepard': 'WR', 'Aaron Rodgers': 'QB', 'Eli Manning': 'QB',
                    'Marshawn Lynch': 'RB', 'Jordan Howard': 'RB', 'Alshon Jeffery': 'WR', 'Jamison Crowder': 'WR'}
        freq_dict = dict(zip(team, [0 for _ in range(len(team))]))
        self.assertEqual('[{"Position": "QB", "Player": "Aaron Rodgers", "DraftFreq": "0%"}, '
                         '{"Position": "RB", "Player": "Saquon Barkley", "DraftFreq": "0%"}, '
                         '{"Position": "RB", "Player": "James Conner", "DraftFreq": "0%"}, '
                         '{"Position": "WR", "Player": "Odell Beckham Jr", "DraftFreq": "0%"}, '
                         '{"Position": "WR", "Player": "Julio Jones", "DraftFreq": "0%"}, '
                         '{"Position": "TE", "Player": "Travis Kelce", "DraftFreq": "0%"}, '
                         '{"Position": "FLEX", "Player": "James White", "DraftFreq": "0%"}, '
                         '{"Position": "DST", "Player": "Packers D/ST", "DraftFreq": "0%"}, '
                         '{"Position": "K", "Player": "Greg Zuerlein", "DraftFreq": "0%"}, '
                         '{"Position": "BE", "Player": "Evan Engram", "DraftFreq": "0%"}, '
                         '{"Position": "BE", "Player": "Sterling Shepard", "DraftFreq": "0%"}, '
                         '{"Position": "BE", "Player": "Eli Manning", "DraftFreq": "0%"}, '
                         '{"Position": "BE", "Player": "Marshawn Lynch", "DraftFreq": "0%"}, '
                         '{"Position": "BE", "Player": "Jordan Howard", "DraftFreq": "0%"}]',
                         order_team(team, freq_dict, pos_dict))

    def test_order_shorter_team(self):
        team = ['Odell Beckham Jr', 'Greg Zuerlein', 'Julio Jones', 'Travis Kelce', 'Evan Engram']
        pos_dict = {'Saquon Barkley': 'RB', 'Odell Beckham Jr': 'WR', 'Greg Zuerlein': 'K', 'Julio Jones': 'WR',
                    'Travis Kelce': 'TE', 'Packers D/ST': 'DST', 'James Conner': 'RB', 'James White': 'RB',
                    'Evan Engram': 'TE', 'Sterling Shepard': 'WR', 'Aaron Rodgers': 'QB', 'Eli Manning': 'QB',
                    'Marshawn Lynch': 'RB', 'Jordan Howard': 'RB', 'Alshon Jeffery': 'WR', 'Jamison Crowder': 'WR'}
        freq_dict = dict(zip(team, [0 for _ in range(len(team))]))
        self.assertEqual('[{"Position": "WR", "Player": "Odell Beckham Jr", "DraftFreq": "0%"}, '
                         '{"Position": "WR", "Player": "Julio Jones", "DraftFreq": "0%"}, '
                         '{"Position": "TE", "Player": "Travis Kelce", "DraftFreq": "0%"}, '
                         '{"Position": "FLEX", "Player": "Evan Engram", "DraftFreq": "0%"}, '
                         '{"Position": "K", "Player": "Greg Zuerlein", "DraftFreq": "0%"}]',
                         order_team(team, freq_dict, pos_dict))


if __name__ == '__main__':
    unittest.main()
