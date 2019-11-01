import unittest
from src.main.optimizer.GetDFSInfo import *


class TestGetDFSInfo(unittest.TestCase):
    def test_get_fd_info(self):
        result = get_fd_info('Thu-Mon', '2019-10-31')
        self.assertEqual({'position': 'RB', 'salary': 9700}, result.get(830517))
