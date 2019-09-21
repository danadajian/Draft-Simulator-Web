import unittest
from src.main.simulator.GetESPNPlayers import *
from src.main.simulator.GetYahooPlayers import *


class GetPlayersTests(unittest.TestCase):
    def test_espn_player_names_valid(self):
        for player in get_espn_players():
            self.assertTrue(player.get('Name').isalpha() or any(x in player.get('Name') for x in [' ', '.', "'", 'D/ST']))
            self.assertTrue(player.get('Position').isalpha() or player.get('Position') == 'DST')

    def test_yahoo_player_names_valid(self):
        for player in get_yahoo_players():
            self.assertTrue(player.get('Name').isalpha() or any(x in player.get('Name') for x in [' ', '.', "'", 'D/ST']))
            self.assertTrue(player.get('Position').isalpha() or player.get('Position') == 'DST')


if __name__ == '__main__':
    unittest.main()
