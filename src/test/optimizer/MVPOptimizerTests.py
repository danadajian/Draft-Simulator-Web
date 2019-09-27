import unittest
from src.main.optimizer.MVPOptimizer import *

fd_proj_dict = {'Aaron Rodgers': 18.76897159035737, 'Carson Wentz': 16.96131300501787, 'Davante Adams': 16.995001770502956, 'Zach Ertz': 12.07922484563967, 'Marquez Valdes-Scantling': 12.436336561063909, 'Aaron Jones': 10.439180625899827, 'Mason Crosby': 9.933806606056788, 'Alshon Jeffery': 8.50999490758205, 'Nelson Agholor': 8.278558980772686, 'Jamaal Williams': 8.272043826490878, 'Jake Elliott': 8.961350855523357, 'Miles Sanders': 8.094280313710899, 'Mack Hollins': 6.6495642585336885, 'Jordan Howard': 6.426010924896807, 'Geronimo Allison': 5.678442010512383, 'Jimmy Graham': 4.351097385646939, 'Darren Sproles': 3.258695379431656, 'Dallas Goedert': 3.048483059082974, 'JJ Arcega-Whiteside': 2.51541061593216, 'Marcedes Lewis': 1.7008825807317367, 'Corey Clement': 1.7678717312919967, 'Robert Tonyan': 1.2686813652240738, 'Danny Vitale': 0.6587200411332143, 'Allen Lazard': 0.13097946389319173, 'Darrius Shepherd': 0.13050112932460584, 'Evan Baylis': 0.09865279393167757, 'Alex Ellis': 0.09013591803380475}
fd_salary_dict = {'Aaron Rodgers': 15000, 'Carson Wentz': 14500, 'Davante Adams': 14000, 'Zach Ertz': 11500, 'Marquez Valdes-Scantling': 11000, 'Aaron Jones': 13000, 'Mason Crosby': 9500, 'Alshon Jeffery': 12000, 'Nelson Agholor': 12500, 'Jamaal Williams': 9000, 'Jake Elliott': 8500, 'Miles Sanders': 10000, 'Mack Hollins': 8000, 'Jordan Howard': 9000, 'Geronimo Allison': 7000, 'Jimmy Graham': 6500, 'Darren Sproles': 6000, 'Dallas Goedert': 5000, 'JJ Arcega-Whiteside': 6500, 'Marcedes Lewis': 5000, 'Corey Clement': 5000, 'Robert Tonyan': 5000, 'Danny Vitale': 5000, 'Allen Lazard': 5000, 'Darrius Shepherd': 5000, 'Evan Baylis': 5000, 'Alex Ellis': 5000}
dk_proj_dict = {'Aaron Rodgers': 20.235346146400968, 'Carson Wentz': 18.415319544171535, 'Davante Adams': 21.783413486646015, 'Zach Ertz': 15.917320540342013, 'Marquez Valdes-Scantling': 15.600827120808278, 'Aaron Jones': 11.901503789361547, 'Mason Crosby': 0.0, 'Alshon Jeffery': 10.298956432972158, 'Nelson Agholor': 10.04679318211832, 'Jamaal Williams': 9.783553196136312, 'Jake Elliott': 0.0, 'Miles Sanders': 9.433766982464046, 'Mack Hollins': 7.993226913393284, 'Jordan Howard': 7.085782042309391, 'Geronimo Allison': 6.739771456486993, 'Jimmy Graham': 5.374513913565288, 'Darren Sproles': 4.169627540213179, 'Dallas Goedert': 3.749952480839729, 'JJ Arcega-Whiteside': 2.9987145779689763, 'Marcedes Lewis': 2.1774928337495254, 'Corey Clement': 2.0999385004018145, 'Robert Tonyan': 1.592643151907135, 'Danny Vitale': 0.8720149156584606, 'Allen Lazard': 0.15973613727004546, 'Darrius Shepherd': 0.15909029431237962, 'Evan Baylis': 0.12669063484815385, 'Alex Ellis': 0.11480757657517136, 'Packers D/ST': 7.64, 'Eagles D/ST': 5.42}
dk_salary_dict = {'Aaron Rodgers': 10800, 'Carson Wentz': 10000, 'Davante Adams': 11000, 'Zach Ertz': 9200, 'Marquez Valdes-Scantling': 7600, 'Aaron Jones': 9000, 'Mason Crosby': 3600, 'Alshon Jeffery': 8200, 'Nelson Agholor': 7800, 'Jamaal Williams': 5000, 'Jake Elliott': 3400, 'Miles Sanders': 6200, 'Mack Hollins': 2400, 'Jordan Howard': 4600, 'Geronimo Allison': 4200, 'Jimmy Graham': 4400, 'Darren Sproles': 2800, 'Dallas Goedert': 1000, 'JJ Arcega-Whiteside': 1800, 'Marcedes Lewis': 600, 'Corey Clement': 200, 'Robert Tonyan': 200, 'Danny Vitale': 400, 'Allen Lazard': 200, 'Darrius Shepherd': 200, 'Evan Baylis': 200, 'Alex Ellis': 200, 'Packers D/ST': 4800, 'Eagles D/ST': 3200}


class MVPOptimizerTests(unittest.TestCase):
    def test_get_total(self):
        test_list = ['player1', 'player2', 'player3']
        test_dict = {'player1': 10, 'player2': 20, 'player3': 30}
        self.assertEqual(60, get_total(test_list, test_dict))

    def test_get_mvp_total(self):
        test_list = ['player1', 'player2', 'player3']
        test_dict = {'player1': 10, 'player2': 20, 'player3': 30}
        self.assertEqual(65, get_mvp_total(test_list, test_dict))

    def test_optimize_mvp_fd(self):
        result_dict = {
            'lineup': ['Aaron Rodgers', 'Davante Adams', 'Marquez Valdes-Scantling', 'Zach Ertz', 'Jake Elliott'],
            'total_pts': 78.62537141826596,
            'total_salary': 60000,
            'max_pts': 78.62537141826596
        }
        self.assertEqual(result_dict, optimize_mvp('fd', [], fd_proj_dict, fd_salary_dict, 5, 60000))

    def test_optimize_mvp_dk(self):
        result_dict = {
            'lineup': ['Marquez Valdes-Scantling', 'Jake Elliott', 'Mack Hollins', 'Geronimo Allison', 'Dallas Goedert',
                       'Corey Clement'],
            'total_pts': 44.76021675654027,
            'total_salary': 50000.0,
            'max_pts': 44.76021675654027
        }
        self.assertEqual(result_dict, optimize_mvp('dk', [], fd_proj_dict, fd_salary_dict, 6, 50000))
