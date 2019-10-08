import unittest
from src.main.optimizer.GetNFLData import *


class TestGetNFLData(unittest.TestCase):
    def test_get_dow_string_current(self):
        self.assertEqual('2019-10-08', get_dow_string(1, 0))

    def test_get_dow_string_past(self):
        self.assertEqual('2019-09-24', get_dow_string(1, 2))

    def test_get_dow_string_sun(self):
        self.assertEqual('2019-10-06', get_dow_string(6, 1))

    def test_get_dow_string_current_sun(self):
        self.assertEqual('2019-10-13', get_dow_string(6, 0))
