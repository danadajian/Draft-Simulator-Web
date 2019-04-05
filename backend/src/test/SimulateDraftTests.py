import unittest
from backend.src.main.SimulateDraft import *


class SimulateDraftTests(unittest.TestCase):
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
        self.assertTrue(all(position_count(team, pos) == pos_counts.get(pos) for pos in pos_counts.keys()))

    def test_full_draft_position_counts_valid_many_sims(self):
        players = []
        teams = 10
        pick = 0
        rounds = 16
        sims = 10
        drafted_teams = simulate_draft(players, teams, pick, rounds, sims)
        pos_counts = {'QB': 2, 'RB': 5, 'WR': 5, 'TE': 2, 'DST': 1, 'K': 1}
        self.assertTrue(all(position_count(team, pos) == pos_counts.get(pos) for pos in pos_counts.keys())
                        for team in drafted_teams)

    def test_calculate_frequencies(self):
        drafted_teams = [['Saquon', 'Odell'], ['Saquon'], ['Odell'], ['Eli', 'Saquon']]
        self.assertEqual({'Saquon': 75.0, 'Odell': 50.0, 'Eli': 25.0}, calculate_frequencies(drafted_teams))

    def test_get_expected_team(self):
        drafted_teams = [['Saquon Barkley', 'Odell Beckham Jr', 'Zach Ertz', 'Rob Gronkowski'],
                         ['Saquon Barkley', 'Evan Engram', 'Zach Ertz', 'Rob Gronkowski'],
                         ['Odell Beckham Jr', 'Evan Engram', 'Aaron Rodgers', 'Rob Gronkowski'],
                         ['Saquon Barkley', 'Eli Manning', 'Zach Ertz', 'Eli Manning']]
        self.assertEqual(['Saquon Barkley', 'Evan Engram', 'Zach Ertz', 'Eli Manning'],
                         get_expected_team(drafted_teams, 4))

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
