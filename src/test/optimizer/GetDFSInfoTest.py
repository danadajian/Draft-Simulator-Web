import unittest
from src.main.optimizer.GetDFSInfo import *


class TestGetDFSInfo(unittest.TestCase):
    def test_get_fd_info_thurs_only(self):
        result = get_fd_info('SF @ ARI', '2019-10-31')
        self.assertEqual({'position': 'QB', 'salary': 15500}, result.get(555358))

    def test_get_fd_info_thu_mon(self):
        result = get_fd_info('Thu-Mon', '2019-10-31')
        self.assertEqual({'position': 'RB', 'salary': 9700}, result.get(830517))
        self.assertEqual({'position': 'RB', 'salary': 8500}, result.get(883302))

    def test_get_fd_info_main(self):
        result = get_fd_info('Main', '2019-11-03')
        self.assertEqual({'position': 'RB', 'salary': 9700}, result.get(830517))
        self.assertIsNone(result.get(543825))
        self.assertIsNone(result.get(883302))

    def test_get_fd_info_sun_mon(self):
        result = get_fd_info('Sun-Mon', '2019-11-03')
        self.assertIsNone(result.get(555358))
        self.assertEqual({'position': 'RB', 'salary': 9700}, result.get(830517))
        self.assertEqual({'position': 'RB', 'salary': 8500}, result.get(883302))
