import unittest
from backend.src.main.Simulator import *
from backend.src.main.GetESPNPlayers import get_espn_players

player_list = get_espn_players()
top300dict = {player.get('Name'): player.get('Position') for player in player_list}


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
        self.assertTrue(create_teams(3) == {'team_2': [], 'team_3': [], 'user_team': []})

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

    def test_pick_players_first_round(self):
        players = [[player_list[0].get('Name')]]
        teams = {'team_2': [], 'team_3': [], 'team_4': [], 'team_5': [], 'team_6': [], 'team_7': [], 'team_8': [],
                 'team_9': [], 'team_10': [], 'user_team': []}
        pick = 1
        order = set_draft_order(teams, pick)
        rounds = 1
        self.assertTrue(pick_players(players, teams, top300dict, order, rounds) == [player_list[0].get('Name')])

    def test_pick_players_later_round(self):
        players = [[player_list[0].get('Name')], [player_list[1].get('Name'), player_list[2].get('Name'), player_list[50].get('Name')]]
        teams = {'team_2': [], 'team_3': [], 'team_4': [], 'team_5': [], 'team_6': [], 'team_7': [], 'team_8': [],
                 'team_9': [], 'team_10': [], 'user_team': []}
        pick = 1
        order = set_draft_order(teams, pick)
        rounds = 2
        self.assertTrue(pick_players(players, teams, top300dict, order, rounds) == [player_list[0].get('Name'), player_list[50].get('Name')])

    def test_pick_players_later_round_random(self):
        players = [[player_list[0].get('Name')], []]
        teams = {'team_2': [], 'team_3': [], 'team_4': [], 'team_5': [], 'team_6': [], 'team_7': [], 'team_8': [],
                 'team_9': [], 'team_10': [], 'user_team': []}
        pick = 1
        order = set_draft_order(teams, pick)
        rounds = 2
        self.assertTrue(pick_players(players, teams, top300dict, order, rounds)[0] == player_list[0].get('Name'))
        self.assertTrue(len(pick_players(players, teams, top300dict, order, rounds)) == rounds)

    def test_pick_players_too_many_rounds_chosen(self):
        players = [[player_list[0].get('Name')], [], [], [], []]
        teams = {'team_2': [], 'team_3': [], 'team_4': [], 'team_5': [], 'team_6': [], 'team_7': [], 'team_8': [],
                 'team_9': [], 'team_10': [], 'user_team': []}
        pick = 1
        order = set_draft_order(teams, pick)
        rounds = 2
        self.assertTrue(pick_players(players, teams, top300dict, order, rounds)[0] == player_list[0].get('Name'))
        self.assertTrue(len(pick_players(players, teams, top300dict, order, rounds)) == rounds)

    def test_drafted_teams_has_correct_form(self):
        players = [[player_list[0].get('Name')], [player_list[69].get('Name')], [], [], []]
        teams = 10
        pick = 1
        rounds = 5
        sims = 10
        self.assertTrue(len(simulate_draft(players, top300dict, teams, pick, rounds, sims)) == sims)
        self.assertTrue(all(len(team) == rounds for team in simulate_draft(players, top300dict, teams, pick, rounds, sims)))

    def test_get_top_pick_one_sim(self):
        players = [[player_list[0].get('Name')]]
        teams = 10
        pick = 1
        rounds = 1
        sims = 1
        self.assertTrue(simulate_draft(players, top300dict, teams, pick, rounds, sims) == [[player_list[0].get('Name')]])

    def test_get_top_pick_many_sims(self):
        players = [[player_list[0].get('Name')]]
        teams = 10
        pick = 1
        rounds = 1
        sims = 10
        self.assertTrue(all(team == [player_list[0].get('Name')] for team in simulate_draft(players, top300dict, teams, pick, rounds, sims)))

    def test_dont_get_top_pick_one_sim(self):
        players = [[player_list[0].get('Name')]]
        teams = 10
        pick = 10
        rounds = 1
        sims = 1
        self.assertTrue(simulate_draft(players, top300dict, teams, pick, rounds, sims) != [[player_list[0].get('Name')]])

    def test_dont_get_top_pick_many_sims(self):
        players = [[player_list[0].get('Name')]]
        teams = 10
        pick = 10
        rounds = 1
        sims = 10
        self.assertTrue(not all(team == [player_list[0].get('Name')] for team in simulate_draft(players, top300dict, teams, pick, rounds, sims)))

    def test_full_draft_position_counts_valid_one_sim(self):
        players = [[player_list[0].get('Name')]]
        teams = 10
        pick = 0
        rounds = 16
        sims = 1
        team = simulate_draft(players, top300dict, teams, pick, rounds, sims)[0]
        pos_counts = {'QB': 2, 'RB': 5, 'WR': 5, 'TE': 2, 'DST': 1, 'K': 1}
        self.assertTrue(all(position_count(team, top300dict, pos) == pos_counts.get(pos) for pos in pos_counts.keys()))

    def test_full_draft_position_counts_valid_many_sims(self):
        players = [[player_list[0].get('Name')]]
        teams = 10
        pick = 0
        rounds = 16
        sims = 10
        drafted_teams = simulate_draft(players, top300dict, teams, pick, rounds, sims)
        pos_counts = {'QB': 2, 'RB': 5, 'WR': 5, 'TE': 2, 'DST': 1, 'K': 1}
        self.assertTrue(all(position_count(team, top300dict, pos) == pos_counts.get(pos) for pos in pos_counts.keys())
                        for team in drafted_teams)

    def test_get_player_round_dict(self):
        user_list = [['Saquon', 'Odell'], ['Kelce', 'Gronk'], ['Mahomes', 'Rodgers']]
        self.assertEqual({'Saquon': 1, 'Odell': 1, 'Kelce': 2, 'Gronk': 2, 'Mahomes': 3, 'Rodgers': 3},
                         get_player_round_dict(user_list))

    def test_calculate_frequencies(self):
        drafted_teams = [['Saquon', 'Odell'], ['Saquon'], ['Odell'], ['Saquon', 'Eli']]
        self.assertEqual({'Saquon': 75.0, 'Odell': 50.0, 'Eli': 25.0}, calculate_frequencies(drafted_teams))

    def test_get_expected_team(self):
        draft_freqs = {'Golden Tate': 50.0, 'Evan Engram': 80.0, 'Eli Manning': 25.0, 'Sterling Shepard': 15.0,
                       'Travis Kelce': 65.0, 'Saquon Barkley': 85.0, 'Zach Ertz': 59.0}
        round_dict = {'Golden Tate': 4, 'Evan Engram': 2, 'Eli Manning': 2, 'Sterling Shepard': 3,
                      'Travis Kelce': 3, 'Saquon Barkley': 1, 'Zach Ertz': 3}
        self.assertEqual(['Saquon Barkley', 'Evan Engram', 'Travis Kelce', 'Golden Tate'],
                         get_expected_team(draft_freqs, top300dict, round_dict, 4))

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
                          'Jamison Crowder'], order_expected_team(team, pos_dict))

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
                         order_expected_team(team, pos_dict))

    def test_order_shorter_team(self):
        team = ['Odell Beckham Jr', 'Greg Zuerlein', 'Julio Jones', 'Travis Kelce', 'Evan Engram']
        pos_dict = {'Saquon Barkley': 'RB', 'Odell Beckham Jr': 'WR', 'Greg Zuerlein': 'K', 'Julio Jones': 'WR',
                    'Travis Kelce': 'TE', 'Packers D/ST': 'DST', 'James Conner': 'RB', 'James White': 'RB',
                    'Evan Engram': 'TE', 'Sterling Shepard': 'WR', 'Aaron Rodgers': 'QB', 'Eli Manning': 'QB',
                    'Marshawn Lynch': 'RB', 'Jordan Howard': 'RB', 'Alshon Jeffery': 'WR', 'Jamison Crowder': 'WR'}
        self.assertEqual(['Odell Beckham Jr', 'Julio Jones', 'Travis Kelce', 'Evan Engram', 'Greg Zuerlein'],
                         order_expected_team(team, pos_dict))

    def test_jsonify_expected_team(self):
        ordered_team = ['Aaron Rodgers', 'Saquon Barkley', 'James Conner', 'Odell Beckham Jr', 'Julio Jones',
                        'Travis Kelce', 'James White', 'Packers D/ST', 'Greg Zuerlein', 'Evan Engram',
                        'Sterling Shepard', 'Eli Manning', 'Marshawn Lynch', 'Jordan Howard', 'Alshon Jeffery',
                        'Jamison Crowder']
        pos_dict = {'Saquon Barkley': 'RB', 'Odell Beckham Jr': 'WR', 'Greg Zuerlein': 'K', 'Julio Jones': 'WR',
                    'Travis Kelce': 'TE', 'Packers D/ST': 'DST', 'James Conner': 'RB', 'James White': 'RB',
                    'Evan Engram': 'TE', 'Sterling Shepard': 'WR', 'Aaron Rodgers': 'QB', 'Eli Manning': 'QB',
                    'Marshawn Lynch': 'RB', 'Jordan Howard': 'RB', 'Alshon Jeffery': 'WR', 'Jamison Crowder': 'WR'}
        team_dict = {'Saquon Barkley': 'NYG', 'Odell Beckham Jr': 'CLE', 'Greg Zuerlein': 'LAR', 'Julio Jones': 'ATL',
                     'Travis Kelce': 'KC', 'Packers D/ST': 'GB', 'James Conner': 'PIT', 'James White': 'NE',
                     'Evan Engram': 'NYG', 'Sterling Shepard': 'NYG', 'Aaron Rodgers': 'GB', 'Eli Manning': 'NYG',
                     'Marshawn Lynch': 'OAK', 'Jordan Howard': 'CHI', 'Alshon Jeffery': 'PHI', 'Jamison Crowder': 'WAS'}
        round_dict = dict(zip(ordered_team, [i + 1 for i in range(len(ordered_team))]))
        freq_dict = dict(zip(ordered_team, [i for i in range(len(ordered_team))]))
        self.assertEqual([{"Name": "Aaron Rodgers", "Position": "QB", "Team": "GB", "Round": 1, "Frequency": "0%"},
                         {"Name": "Saquon Barkley", "Position": "RB", "Team": "NYG", "Round": 2, "Frequency": "1%"},
                         {"Name": "James Conner", "Position": "RB", "Team": "PIT", "Round": 3, "Frequency": "2%"},
                         {"Name": "Odell Beckham Jr", "Position": "WR", "Team": "CLE", "Round": 4, "Frequency": "3%"},
                         {"Name": "Julio Jones", "Position": "WR", "Team": "ATL", "Round": 5, "Frequency": "4%"},
                         {"Name": "Travis Kelce", "Position": "TE", "Team": "KC", "Round": 6, "Frequency": "5%"},
                         {"Name": "James White", "Position": "FLEX", "Team": "NE", "Round": 7, "Frequency": "6%"},
                         {"Name": "Packers D/ST", "Position": "DST", "Team": "GB", "Round": 8, "Frequency": "7%"},
                         {"Name": "Greg Zuerlein", "Position": "K", "Team": "LAR", "Round": 9, "Frequency": "8%"},
                         {"Name": "Evan Engram", "Position": "BE", "Team": "NYG", "Round": 10, "Frequency": "9%"},
                         {"Name": "Sterling Shepard", "Position": "BE", "Team": "NYG", "Round": 11, "Frequency": "10%"},
                         {"Name": "Eli Manning", "Position": "BE", "Team": "NYG", "Round": 12, "Frequency": "11%"},
                         {"Name": "Marshawn Lynch", "Position": "BE", "Team": "OAK", "Round": 13, "Frequency": "12%"},
                         {"Name": "Jordan Howard", "Position": "BE", "Team": "CHI", "Round": 14, "Frequency": "13%"},
                          {"Name": "Alshon Jeffery", "Position": "BE", "Team": "PHI", "Round": 15, "Frequency": "14%"},
                         {"Name": "Jamison Crowder", "Position": "BE", "Team": "WAS", "Round": 16, "Frequency": "15%"}],
                         jsonify_expected_team(ordered_team, pos_dict, team_dict, round_dict, freq_dict))


if __name__ == '__main__':
    unittest.main()
