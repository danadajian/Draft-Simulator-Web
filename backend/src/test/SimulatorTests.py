import unittest
from backend.src.main.Simulator import *
from backend.src.main.GetESPNPlayers import get_player_dict

top300dict = get_player_dict()


class SimulateDraftTests(unittest.TestCase):
    def test_position_count(self):
        test_list = ['Saquon Barkley', 'Odell Beckham Jr', 'Julio Jones', 'Travis Kelce', 'Zach Ertz']
        pos_dict = {'Saquon Barkley': 'RB', 'Odell Beckham Jr': 'WR', 'Julio Jones': 'WR', 'Travis Kelce': 'TE'}
        self.assertEqual(2, position_count(test_list, pos_dict, 'WR'))

    def test_is_valid_choice(self):
        test_team = ['Saquon Barkley', 'Odell Beckham Jr', 'Julio Jones', 'Travis Kelce', 'Jaguars D/ST']
        pos_dict = {'Aaron Rodgers': 'QB', 'Odell Beckham Jr': 'WR', 'Julio Jones': 'WR', 'Adam Thielen': 'WR',
                    'Jaguars D/ST': 'DST', 'Ravens D/ST': 'DST'}
        self.assertTrue(is_valid_choice('Aaron Rodgers', pos_dict, test_team))
        self.assertTrue(is_valid_choice('Adam Thielen', pos_dict, test_team))
        self.assertFalse(is_valid_choice('Ravens D/ST', pos_dict, test_team))
        self.assertFalse(is_valid_choice(None, pos_dict, test_team))

    def test_create_teams(self):
        count = 3
        user_team = []
        self.assertTrue(create_teams(count, user_team) == {'team_2': [], 'team_3': [], 'user_team': []})

    def test_set_draft_order(self):
        teams = {'team_2': [], 'team_3': [], 'team_4': [], 'team_5': [], 'team_6': [], 'team_7': [], 'team_8': [],
                 'team_9': [], 'team_10': [], 'user_team': []}
        pick = 5
        self.assertTrue(set_draft_order(teams, pick)[pick - 1] == 'user_team')
        self.assertTrue(set_draft_order(teams, pick) == set_draft_order(teams, pick))

    def test_random_draft_order(self):
        teams = {'team_2': [], 'team_3': [], 'team_4': [], 'team_5': [], 'team_6': [], 'team_7': [], 'team_8': [],
                 'team_9': [], 'team_10': [], 'user_team': []}
        pick = 0
        order1 = set_draft_order(teams, pick)
        order2 = set_draft_order(teams, pick)
        order3 = set_draft_order(teams, pick)
        self.assertTrue(order1 != order2 or order1 != order3 or order2 != order3)
        self.assertTrue(set_draft_order(teams, pick) != teams)

    def test_pick_players(self):
        players = ['Saquon Barkley']
        teams = {'team_2': [], 'team_3': [], 'team_4': [], 'team_5': [], 'team_6': [], 'team_7': [], 'team_8': [],
                 'team_9': [], 'team_10': [], 'user_team': []}
        pick = 1
        order = set_draft_order(teams, pick)
        rounds = 1
        self.assertTrue(pick_players(players, teams, order, rounds) == ['Saquon Barkley'])

    def test_drafted_teams_has_correct_form(self):
        players = ['Saquon Barkley']
        teams = 10
        pick = 1
        rounds = 5
        sims = 10
        self.assertTrue(len(simulate_draft(players, teams, pick, rounds, sims)) == sims)
        self.assertTrue(all(len(team) == rounds for team in simulate_draft(players, teams, pick, rounds, sims)))

    def test_get_top_pick_one_sim(self):
        players = ['Saquon Barkley']
        teams = 10
        pick = 1
        rounds = 1
        sims = 1
        self.assertTrue(simulate_draft(players, teams, pick, rounds, sims) == [['Saquon Barkley']])

    def test_get_top_pick_many_sims(self):
        players = ['Saquon Barkley']
        teams = 10
        pick = 1
        rounds = 1
        sims = 10
        self.assertTrue(all('Saquon Barkley' in team for team in simulate_draft(players, teams, pick, rounds, sims)))

    def test_dont_get_top_pick_one_sim(self):
        players = ['Saquon Barkley']
        teams = 10
        pick = 10
        rounds = 1
        sims = 1
        self.assertTrue(simulate_draft(players, teams, pick, rounds, sims) != [['Saquon Barkley']])

    def test_dont_get_top_pick_many_sims(self):
        players = ['Saquon Barkley']
        teams = 10
        pick = 10
        rounds = 1
        sims = 10
        self.assertTrue(not all('Saquon Barkley' in team for team in simulate_draft(players, teams, pick, rounds, sims)))

    def test_full_draft_position_counts_valid_one_sim(self):
        players = []
        teams = 10
        pick = 0
        rounds = 16
        sims = 1
        team = simulate_draft(players, teams, pick, rounds, sims)[0]
        pos_counts = {'QB': 2, 'RB': 5, 'WR': 5, 'TE': 2, 'DST': 1, 'K': 1}
        self.assertTrue(all(position_count(team, top300dict, pos) == pos_counts.get(pos) for pos in pos_counts.keys()))

    def test_full_draft_position_counts_valid_many_sims(self):
        players = []
        teams = 10
        pick = 0
        rounds = 16
        sims = 10
        drafted_teams = simulate_draft(players, teams, pick, rounds, sims)
        pos_counts = {'QB': 2, 'RB': 5, 'WR': 5, 'TE': 2, 'DST': 1, 'K': 1}
        self.assertTrue(all(position_count(team, top300dict, pos) == pos_counts.get(pos) for pos in pos_counts.keys())
                        for team in drafted_teams)

    def test_calculate_frequencies(self):
        drafted_teams = [['Saquon', 'Odell'], ['Saquon'], ['Odell'], ['Eli', 'Saquon']]
        self.assertEqual({'Saquon': 75.0, 'Odell': 50.0, 'Eli': 25.0}, calculate_frequencies(drafted_teams))

    def test_get_expected_team(self):
        draft_freqs = {'Golden Tate': 50.0, 'Evan Engram': 80.0, 'Eli Manning': 25.0, 'Sterling Shepard': 15.0,
                       'Travis Kelce': 65.0, 'Saquon Barkley': 85.0, 'Zach Ertz': 59.0}
        self.assertEqual(['Saquon Barkley', 'Evan Engram', 'Travis Kelce', 'Golden Tate'],
                         get_expected_team(draft_freqs, 4))

    def test_order_team(self):
        team = ['Saquon Barkley', 'Odell Beckham Jr', 'Greg Zuerlein', 'Julio Jones', 'Travis Kelce', 'Packers D/ST',
                'James Conner', 'James White', 'Evan Engram', 'Sterling Shepard', 'Aaron Rodgers', 'Eli Manning',
                'Marshawn Lynch', 'Jordan Howard', 'Alshon Jeffery', 'Jamison Crowder']
        pos_dict = {'Saquon Barkley': 'RB', 'Odell Beckham Jr': 'WR', 'Greg Zuerlein': 'K', 'Julio Jones': 'WR',
                    'Travis Kelce': 'TE', 'Packers D/ST': 'DST', 'James Conner': 'RB', 'James White': 'RB',
                    'Evan Engram': 'TE', 'Sterling Shepard': 'WR', 'Aaron Rodgers': 'QB', 'Eli Manning': 'QB',
                    'Marshawn Lynch': 'RB', 'Jordan Howard': 'RB', 'Alshon Jeffery': 'WR', 'Jamison Crowder': 'WR'}
        self.assertEqual(['Aaron Rodgers', 'Saquon Barkley', 'James Conner', 'Odell Beckham Jr', 'Julio Jones',
                          'Travis Kelce', 'James White', 'Packers D/ST', 'Greg Zuerlein', 'Evan Engram',
                          'Sterling Shepard', 'Eli Manning', 'Marshawn Lynch', 'Jordan Howard', 'Alshon Jeffery',
                          'Jamison Crowder'], order_team(team, pos_dict))

    def test_order_short_team(self):
        team = ['Saquon Barkley', 'Odell Beckham Jr', 'Greg Zuerlein', 'Julio Jones', 'Travis Kelce', 'Packers D/ST',
                'James Conner', 'James White', 'Evan Engram', 'Sterling Shepard', 'Aaron Rodgers', 'Eli Manning',
                'Marshawn Lynch', 'Jordan Howard']
        pos_dict = {'Saquon Barkley': 'RB', 'Odell Beckham Jr': 'WR', 'Greg Zuerlein': 'K', 'Julio Jones': 'WR',
                    'Travis Kelce': 'TE', 'Packers D/ST': 'DST', 'James Conner': 'RB', 'James White': 'RB',
                    'Evan Engram': 'TE', 'Sterling Shepard': 'WR', 'Aaron Rodgers': 'QB', 'Eli Manning': 'QB',
                    'Marshawn Lynch': 'RB', 'Jordan Howard': 'RB', 'Alshon Jeffery': 'WR', 'Jamison Crowder': 'WR'}
        self.assertEqual(['Aaron Rodgers', 'Saquon Barkley', 'James Conner', 'Odell Beckham Jr', 'Julio Jones',
                          'Travis Kelce', 'James White', 'Packers D/ST', 'Greg Zuerlein', 'Evan Engram',
                          'Sterling Shepard', 'Eli Manning', 'Marshawn Lynch', 'Jordan Howard'],
                         order_team(team, pos_dict))

    def test_order_shorter_team(self):
        team = ['Odell Beckham Jr', 'Greg Zuerlein', 'Julio Jones', 'Travis Kelce', 'Evan Engram']
        pos_dict = {'Saquon Barkley': 'RB', 'Odell Beckham Jr': 'WR', 'Greg Zuerlein': 'K', 'Julio Jones': 'WR',
                    'Travis Kelce': 'TE', 'Packers D/ST': 'DST', 'James Conner': 'RB', 'James White': 'RB',
                    'Evan Engram': 'TE', 'Sterling Shepard': 'WR', 'Aaron Rodgers': 'QB', 'Eli Manning': 'QB',
                    'Marshawn Lynch': 'RB', 'Jordan Howard': 'RB', 'Alshon Jeffery': 'WR', 'Jamison Crowder': 'WR'}
        self.assertEqual(['Odell Beckham Jr', 'Julio Jones', 'Travis Kelce', 'Evan Engram', 'Greg Zuerlein'],
                         order_team(team, pos_dict))

    def test_make_ordered_team_nice(self):
        ordered_team = ['Aaron Rodgers', 'Saquon Barkley', 'James Conner', 'Odell Beckham Jr', 'Julio Jones',
                        'Travis Kelce', 'James White', 'Packers D/ST', 'Greg Zuerlein', 'Evan Engram',
                        'Sterling Shepard', 'Eli Manning', 'Marshawn Lynch', 'Jordan Howard', 'Alshon Jeffery',
                        'Jamison Crowder']
        pos_dict = {'Saquon Barkley': 'RB', 'Odell Beckham Jr': 'WR', 'Greg Zuerlein': 'K', 'Julio Jones': 'WR',
                    'Travis Kelce': 'TE', 'Packers D/ST': 'DST', 'James Conner': 'RB', 'James White': 'RB',
                    'Evan Engram': 'TE', 'Sterling Shepard': 'WR', 'Aaron Rodgers': 'QB', 'Eli Manning': 'QB',
                    'Marshawn Lynch': 'RB', 'Jordan Howard': 'RB', 'Alshon Jeffery': 'WR', 'Jamison Crowder': 'WR'}
        freq_dict = dict(zip(ordered_team, [i for i in range(len(ordered_team))]))
        self.assertEqual('[{"Position": "QB", "Player": "Aaron Rodgers", "DraftFreq": "0%"}, '
                         '{"Position": "RB", "Player": "Saquon Barkley", "DraftFreq": "1%"}, '
                         '{"Position": "RB", "Player": "James Conner", "DraftFreq": "2%"}, '
                         '{"Position": "WR", "Player": "Odell Beckham Jr", "DraftFreq": "3%"}, '
                         '{"Position": "WR", "Player": "Julio Jones", "DraftFreq": "4%"}, '
                         '{"Position": "TE", "Player": "Travis Kelce", "DraftFreq": "5%"}, '
                         '{"Position": "FLEX", "Player": "James White", "DraftFreq": "6%"}, '
                         '{"Position": "DST", "Player": "Packers D/ST", "DraftFreq": "7%"}, '
                         '{"Position": "K", "Player": "Greg Zuerlein", "DraftFreq": "8%"}, '
                         '{"Position": "BE", "Player": "Evan Engram", "DraftFreq": "9%"}, '
                         '{"Position": "BE", "Player": "Sterling Shepard", "DraftFreq": "10%"}, '
                         '{"Position": "BE", "Player": "Eli Manning", "DraftFreq": "11%"}, '
                         '{"Position": "BE", "Player": "Marshawn Lynch", "DraftFreq": "12%"}, '
                         '{"Position": "BE", "Player": "Jordan Howard", "DraftFreq": "13%"}, '
                         '{"Position": "BE", "Player": "Alshon Jeffery", "DraftFreq": "14%"}, '
                         '{"Position": "BE", "Player": "Jamison Crowder", "DraftFreq": "15%"}]',
                         make_ordered_team_nice(ordered_team, freq_dict, pos_dict))

    def test_aggregate_data(self):
        freq_dict = {'Saquon Barkley': 75.0, 'Odell Beckham Jr': 50.0, 'Eli Manning': 25.0}
        user_player_list = ['Eli Manning', 'Saquon Barkley']
        self.assertEqual('[{"Position": "RB", "Player": "Saquon Barkley", "DraftFreq": "75.0%"}, '
                         '{"Position": "QB", "Player": "Eli Manning", "DraftFreq": "25.0%"}]|'
                         '[{"Position": "RB", "Player": "Saquon Barkley", "DraftFreq": "75.0%"}, '
                         '{"Position": "WR", "Player": "Odell Beckham Jr", "DraftFreq": "50.0%"}, '
                         '{"Position": "QB", "Player": "Eli Manning", "DraftFreq": "25.0%"}]'
                         ,
                         aggregate_data(freq_dict, user_player_list))


if __name__ == '__main__':
    unittest.main()
