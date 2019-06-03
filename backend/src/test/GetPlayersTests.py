import unittest
from backend.src.main.GetESPNPlayers import *


class GetPlayersTests(unittest.TestCase):

    def test_http_response_200(self):
        self.assertEqual(str(request), '<Response [200]>')

    def test_player_names_valid(self):
        for player in top300List:
            self.assertTrue(player.isalpha() or any(x in player for x in [' ', '.', "'", 'D/ST']))

    def test_pos_names_valid(self):
        for pos in top300List:
            if not pos != 'D/ST':
                self.assertTrue(pos.isalpha())


if __name__ == '__main__':
    unittest.main()
