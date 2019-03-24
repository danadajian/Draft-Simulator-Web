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
        self.assertTrue(set_draft_order(teams, pick) != set_draft_order(teams, pick))
        self.assertTrue(set_draft_order(teams, pick).index('user_team') != set_draft_order(teams, pick).index(
            'user_team'))

    def test_pick_players(self):
        players = ['Saquon Barkley']
        teams = {'team_2': [], 'team_3': [], 'team_4': [], 'team_5': [], 'team_6': [], 'team_7': [], 'team_8': [],
                 'team_9': [], 'team_10': [], 'user_team': []}
        pick = 1
        order = set_draft_order(teams, pick)
        rounds = 1
        self.assertTrue(pick_players(players, teams, order, rounds) == ['Saquon Barkley'])

    def test_one_player_one_sim(self):
        players = ['Saquon Barkley']
        teams = 10
        pick = 1
        rounds = 1
        sims = 1
        self.assertTrue(simulate_draft(players, teams, pick, rounds, sims) == [['Saquon Barkley']])

    def test_one_player_many_sims(self):
        players = ['Saquon Barkley']
        teams = 10
        pick = 1
        rounds = 1
        sims = 100
        print(simulate_draft(players, teams, pick, rounds, sims))
        self.assertTrue(all('Saquon Barkley' in team for team in simulate_draft(players, teams, pick, rounds, sims)))


if __name__ == '__main__':
    unittest.main()
