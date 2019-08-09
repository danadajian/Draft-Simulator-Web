import unittest
from backend.src.main.Simulator import *

top300dict = {'Saquon Barkley': 'RB', 'Christian McCaffrey': 'RB', 'Alvin Kamara': 'RB', 'Ezekiel Elliott': 'RB', "Le'Veon Bell": 'RB', 'David Johnson': 'RB', 'Davante Adams': 'WR', 'DeAndre Hopkins': 'WR', 'Julio Jones': 'WR', 'Odell Beckham Jr': 'WR', 'Todd Gurley II': 'RB', 'Melvin Gordon': 'RB', 'Travis Kelce': 'TE', 'Joe Mixon': 'RB', 'Michael Thomas': 'WR', 'Tyreek Hill': 'WR', 'Antonio Brown': 'WR', 'James Conner': 'RB', 'JuJu Smith-Schuster': 'WR', 'Mike Evans': 'WR', 'Dalvin Cook': 'RB', 'T.Y. Hilton': 'WR', 'Leonard Fournette': 'RB', 'Keenan Allen': 'WR', 'Amari Cooper': 'WR', 'George Kittle': 'TE', 'Zach Ertz': 'TE', 'Devonta Freeman': 'RB', 'Nick Chubb': 'RB', 'Adam Thielen': 'WR', 'Brandin Cooks': 'WR', 'Julian Edelman': 'WR', 'Stefon Diggs': 'WR', 'Derrick Henry': 'RB', 'Kerryon Johnson': 'RB', 'Josh Jacobs': 'RB', 'Marlon Mack': 'RB', 'Sony Michel': 'RB', 'Kenny Golladay': 'WR', 'Robert Woods': 'WR', 'Alshon Jeffery': 'WR', 'Chris Godwin': 'WR', 'Tyler Lockett': 'WR', 'Chris Carson': 'RB', 'Aaron Jones': 'RB', 'Damien Williams': 'RB', 'Patrick Mahomes': 'QB', 'Mark Ingram II': 'RB', 'Lamar Miller': 'RB', 'Phillip Lindsay': 'RB', 'Mike Williams': 'WR', 'Cooper Kupp': 'WR', 'DJ Moore': 'WR', 'Tyler Boyd': 'WR', 'Sammy Watkins': 'WR', 'A.J. Green': 'WR', 'Calvin Ridley': 'WR', 'Allen Robinson': 'WR', 'Evan Engram': 'TE', 'Kenyan Drake': 'RB', 'James White': 'RB', 'David Montgomery': 'RB', 'Derrius Guice': 'RB', 'Robby Anderson': 'WR', 'Marvin Jones Jr': 'WR', 'O.J. Howard': 'TE', 'Hunter Henry': 'TE', 'Royce Freeman': 'RB', 'Miles Sanders': 'RB', 'Tevin Coleman': 'RB', 'Rashaad Penny': 'RB', 'Deshaun Watson': 'QB', 'Aaron Rodgers': 'QB', 'Matt Ryan': 'QB', 'Andrew Luck': 'QB', 'Jarvis Landry': 'WR', 'Sterling Shepard': 'WR', 'Will Fuller V': 'WR', 'Christian Kirk': 'WR', 'Dante Pettis': 'WR', 'Dede Westbrook': 'WR', 'Emmanuel Sanders': 'WR', 'Curtis Samuel': 'WR', 'Jared Cook': 'TE', 'Tarik Cohen': 'RB', 'Darrell Henderson': 'RB', 'Latavius Murray': 'RB', 'Jordan Howard': 'RB', 'Austin Ekeler': 'RB', 'Ronald Jones': 'RB', 'Kalen Ballage': 'RB', 'Matt Breida': 'RB', 'Carlos Hyde': 'RB', 'Courtland Sutton': 'WR', 'Corey Davis': 'WR', 'Michael Gallup': 'WR', 'Marquez Valdes-Scantling': 'WR', 'Larry Fitzgerald': 'WR', 'David Njoku': 'TE', 'Eric Ebron': 'TE', 'Vance McDonald': 'TE', 'Cam Newton': 'QB', 'Baker Mayfield': 'QB', 'Donte Moncrief': 'WR', 'DeSean Jackson': 'WR', 'James Washington': 'WR', 'Anthony Miller': 'WR', 'Devin Funchess': 'WR', 'Delanie Walker': 'TE', 'Trey Burton': 'TE', 'Carson Wentz': 'QB', 'Drew Brees': 'QB', 'Ben Roethlisberger': 'QB', 'Dak Prescott': 'QB', 'Russell Wilson': 'QB', 'Peyton Barber': 'RB', 'LeSean McCoy': 'RB', 'Nyheim Hines': 'RB', 'Jerick McKinnon': 'RB', 'Duke Johnson Jr': 'RB', 'Kyler Murray': 'QB', 'Jared Goff': 'QB', 'Tom Brady': 'QB', 'Tyrell Williams': 'WR', 'DK Metcalf': 'WR', 'Geronimo Allison': 'WR', 'Keke Coutee': 'WR', 'Kenny Stills': 'WR', "N'Keal Harry": 'WR', 'Jamison Crowder': 'WR', 'Parris Campbell': 'WR', 'Austin Hooper': 'TE', 'Jordan Reed': 'TE', 'Greg Olsen': 'TE', 'Adam Humphries': 'WR', 'Golden Tate': 'WR', 'Marquise Brown': 'WR', 'Albert Wilson': 'WR', 'Mitchell Trubisky': 'QB', 'Jameis Winston': 'QB', 'Bears D/ST': 'DST', 'Jaguars D/ST': 'DST', 'Bills D/ST': 'DST', 'Rams D/ST': 'DST', 'Vikings D/ST': 'DST', 'Saints D/ST': 'DST', 'Chargers D/ST': 'DST', 'Patriots D/ST': 'DST', 'Colts D/ST': 'DST', 'Titans D/ST': 'DST', 'Greg Zuerlein': 'K', 'Justin Tucker': 'K', 'Wil Lutz': 'K', 'Harrison Butker': 'K', 'Stephen Gostkowski': 'K', "Ka'imi Fairbairn": 'K', 'Robbie Gould': 'K', 'Mike Badgley': 'K', 'Adam Vinatieri': 'K', 'Brett Maher': 'K', 'Mohamed Sanu': 'WR', 'Paul Richardson': 'WR', 'DaeSean Hamilton': 'WR', "Tre'Quan Smith": 'WR', 'John Brown': 'WR', 'DJ Chark': 'WR', 'Jimmy Graham': 'TE', 'Kyle Rudolph': 'TE', 'Lamar Jackson': 'QB', 'Philip Rivers': 'QB', 'Mike Davis': 'RB', 'C.J. Anderson': 'RB', 'Giovani Bernard': 'RB', 'Jamaal Williams': 'RB', 'Jalen Richard': 'RB', 'Chris Thompson': 'RB', 'Mark Andrews': 'TE', 'Jack Doyle': 'TE', 'Deebo Samuel': 'WR', 'Andy Isabella': 'WR', 'A.J. Brown': 'WR', 'Ted Ginn Jr': 'WR', 'Kirk Cousins': 'QB', 'Jaylen Samuels': 'RB', 'Dion Lewis': 'RB', 'Devin Singletary': 'RB', 'Damien Harris': 'RB', 'Kareem Hunt': 'RB', 'Broncos D/ST': 'DST', 'Texans D/ST': 'DST', 'Matt Prater': 'K', 'Jake Elliott': 'K', 'Noah Fant': 'TE', 'Justice Hill': 'RB', 'Justin Jackson': 'RB', 'Hakeem Butler': 'WR', 'Mecole Hardman': 'WR', 'Randall Cobb': 'WR', 'Ito Smith': 'RB', 'Theo Riddick': 'RB', 'Alexander Mattison': 'RB', 'Gus Edwards': 'RB', 'Adrian Peterson': 'RB', 'Chase Edmonds': 'RB', 'Benny Snell Jr': 'RB', 'Doug Martin': 'RB', 'Frank Gore': 'RB', 'Darwin Thompson': 'RB', 'Rex Burkhead': 'RB', 'T.J. Hockenson': 'TE', 'Will Dissly': 'TE', 'Derek Carr': 'QB', 'DeVante Parker': 'WR', 'Zay Jones': 'WR', 'Chris Conley': 'WR', 'Cole Beasley': 'WR', 'Quincy Enunwa': 'WR', 'Willie Snead IV': 'WR', 'Sam Darnold': 'QB', 'Jimmy Garoppolo': 'QB', 'Eagles D/ST': 'DST', 'Browns D/ST': 'DST', 'Mason Crosby': 'K', 'Ryan Succop': 'K', 'Josh Doctson': 'WR', 'Marquise Goodwin': 'WR', 'Trey Quinn': 'WR', 'Nelson Agholor': 'WR', 'John Ross': 'WR', 'Marqise Lee': 'WR', 'Robert Foster': 'WR', 'Terry McLaurin': 'WR', 'JJ Arcega-Whiteside': 'WR', 'Antonio Callaway': 'WR', 'Darren Sproles': 'RB', 'Andre Ellington': 'RB', 'Wayne Gallman': 'RB', 'Ryquell Armstead': 'RB', 'Malcolm Brown': 'RB', 'Ty Montgomery': 'RB', 'Alfred Blue': 'RB', 'T.J. Yeldon': 'RB', 'Josh Allen': 'QB', 'Matthew Stafford': 'QB', 'Marcus Mariota': 'QB', 'Mike Gesicki': 'TE', 'Dallas Goedert': 'TE', 'Chris Herndon': 'TE', 'Darren Waller': 'TE', 'Tony Pollard': 'RB', 'Diontae Johnson': 'WR', 'Hunter Renfrow': 'WR', 'Ravens D/ST': 'DST', 'Steelers D/ST': 'DST', 'Aldrick Rosas': 'K', 'Giorgio Tavecchio': 'K', 'Jason Witten': 'TE', 'Matt LaCosse': 'TE', 'Gerald Everett': 'TE', 'Josh Reynolds': 'WR', 'Miles Boykin': 'WR', 'Breshad Perriman': 'WR', 'Demaryius Thomas': 'WR', 'Bilal Powell': 'RB', 'Bryce Love': 'RB', 'Andy Dalton': 'QB', 'Eli Manning': 'QB', 'Joe Flacco': 'QB', 'Nick Foles': 'QB', 'Ryan Fitzpatrick': 'QB', 'David Moore': 'WR', 'Taylor Gabriel': 'WR', 'Danny Amendola': 'WR', 'Darius Slayton': 'WR', 'KeeSean Johnson': 'WR', 'Cameron Artis-Payne': 'RB', 'Jordan Wilkins': 'RB', 'Dexter Williams': 'RB', 'Qadree Ollison': 'RB', 'Josh Ferguson': 'RB', 'Karan Higdon': 'RB', 'Alfred Morris': 'RB', 'Mark Walton': 'RB', 'Gary Jennings Jr': 'WR', 'Panthers D/ST': 'DST', 'Redskins D/ST': 'DST', 'Graham Gano': 'K', 'Jason Myers': 'K', 'Tyler Eifert': 'TE', 'Benjamin Watson': 'TE', 'Jordan Thomas': 'TE', 'Hayden Hurst': 'TE', 'Dawson Knox': 'TE', 'Chris Moore': 'WR', 'Travis Benjamin': 'WR', 'Dwayne Haskins': 'QB', 'Chiefs D/ST': 'DST', 'Cowboys D/ST': 'DST', 'Cardinals D/ST': 'DST'}


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
        players = [['Saquon Barkley']]
        teams = {'team_2': [], 'team_3': [], 'team_4': [], 'team_5': [], 'team_6': [], 'team_7': [], 'team_8': [],
                 'team_9': [], 'team_10': [], 'user_team': []}
        pick = 1
        order = set_draft_order(teams, pick)
        rounds = 1
        self.assertTrue(pick_players(players, teams, top300dict, order, rounds) == ['Saquon Barkley'])

    def test_pick_players_later_round(self):
        players = [['Saquon Barkley'], ['Alvin Kamara', 'Christian McCaffrey', 'Patrick Mahomes']]
        teams = {'team_2': [], 'team_3': [], 'team_4': [], 'team_5': [], 'team_6': [], 'team_7': [], 'team_8': [],
                 'team_9': [], 'team_10': [], 'user_team': []}
        pick = 1
        order = set_draft_order(teams, pick)
        rounds = 2
        self.assertTrue(pick_players(players, teams, top300dict, order, rounds) == ['Saquon Barkley', 'Patrick Mahomes'])

    def test_pick_players_later_round_random(self):
        players = [['Saquon Barkley'], []]
        teams = {'team_2': [], 'team_3': [], 'team_4': [], 'team_5': [], 'team_6': [], 'team_7': [], 'team_8': [],
                 'team_9': [], 'team_10': [], 'user_team': []}
        pick = 1
        order = set_draft_order(teams, pick)
        rounds = 2
        self.assertTrue(pick_players(players, teams, top300dict, order, rounds)[0] == 'Saquon Barkley')
        self.assertTrue(len(pick_players(players, teams, top300dict, order, rounds)) == rounds)

    def test_pick_players_missing_round(self):
        players = [['Ezekiel Elliot', 'Alvin Kamara', 'DeAndre Hopkins', 'Odell Beckham Jr'],
                   ["Le'Veon Bell", 'Todd Gurley II'], [], ['Julio Jones']]
        teams = {'team_2': [], 'team_3': [], 'team_4': [], 'team_5': [], 'team_6': [], 'team_7': [], 'team_8': [],
                 'team_9': [], 'team_10': [], 'user_team': []}
        pick = 5
        order = set_draft_order(teams, pick)
        rounds = 16
        first_round_pick = pick_players(players, teams, top300dict, order, rounds)[0]
        fourth_round_pick = pick_players(players, teams, top300dict, order, rounds)[3]
        self.assertTrue(first_round_pick in ['Ezekiel Elliot', 'Alvin Kamara', 'DeAndre Hopkins', 'Odell Beckham Jr'])
        self.assertTrue(fourth_round_pick not in ['Julio Jones'])
        self.assertTrue(len(pick_players(players, teams, top300dict, order, rounds)) == rounds)

    def test_pick_players_too_many_rounds_chosen(self):
        players = [['Saquon Barkley'], [], [], [], []]
        teams = {'team_2': [], 'team_3': [], 'team_4': [], 'team_5': [], 'team_6': [], 'team_7': [], 'team_8': [],
                 'team_9': [], 'team_10': [], 'user_team': []}
        pick = 1
        order = set_draft_order(teams, pick)
        rounds = 2
        self.assertTrue(pick_players(players, teams, top300dict, order, rounds)[0] == 'Saquon Barkley')
        self.assertTrue(len(pick_players(players, teams, top300dict, order, rounds)) == rounds)

    def test_drafted_teams_has_correct_form(self):
        players = [['Saquon Barkley'], ['Eli Manning'], [], [], []]
        teams = 10
        pick = 1
        rounds = 5
        sims = 10
        self.assertTrue(len(simulate_draft(players, top300dict, teams, pick, rounds, sims)) == sims)
        self.assertTrue(all(len(team) == rounds for team in simulate_draft(players, top300dict, teams, pick, rounds, sims)))

    def test_get_top_pick_one_sim(self):
        players = [['Saquon Barkley']]
        teams = 10
        pick = 1
        rounds = 1
        sims = 1
        self.assertTrue(simulate_draft(players, top300dict, teams, pick, rounds, sims) == [['Saquon Barkley']])

    def test_get_top_pick_many_sims(self):
        players = [['Saquon Barkley']]
        teams = 10
        pick = 1
        rounds = 1
        sims = 10
        self.assertTrue(all(team == ['Saquon Barkley'] for team in simulate_draft(players, top300dict, teams, pick, rounds, sims)))

    def test_dont_get_top_pick_one_sim(self):
        players = [['Saquon Barkley']]
        teams = 10
        pick = 10
        rounds = 1
        sims = 1
        self.assertTrue(simulate_draft(players, top300dict, teams, pick, rounds, sims) != [['Saquon Barkley']])

    def test_dont_get_top_pick_many_sims(self):
        players = [['Saquon Barkley']]
        teams = 10
        pick = 10
        rounds = 1
        sims = 10
        self.assertTrue(not all(team == ['Saquon Barkley'] for team in simulate_draft(players, top300dict, teams, pick, rounds, sims)))

    def test_full_draft_position_counts_valid_one_sim(self):
        players = [['Saquon Barkley']]
        teams = 10
        pick = 0
        rounds = 16
        sims = 1
        team = simulate_draft(players, top300dict, teams, pick, rounds, sims)[0]
        pos_counts = {'QB': 2, 'RB': 5, 'WR': 5, 'TE': 2, 'DST': 1, 'K': 1}
        self.assertTrue(all(position_count(team, top300dict, pos) == pos_counts.get(pos) for pos in pos_counts.keys()))

    def test_full_draft_position_counts_valid_many_sims(self):
        players = [['Saquon Barkley']]
        teams = 10
        pick = 0
        rounds = 16
        sims = 10
        drafted_teams = simulate_draft(players, top300dict, teams, pick, rounds, sims)
        pos_counts = {'QB': 2, 'RB': 5, 'WR': 5, 'TE': 2, 'DST': 1, 'K': 1}
        self.assertTrue(all(position_count(team, top300dict, pos) == pos_counts.get(pos) for pos in pos_counts.keys())
                        for team in drafted_teams)

    def test_get_player_round_dict(self):
        drafted_teams = [['Saquon', 'Odell'], ['Kelce', 'Gronk'], ['Mahomes', 'Rodgers']]
        self.assertEqual({'Saquon': 1, 'Odell': 2, 'Kelce': 1, 'Gronk': 2, 'Mahomes': 1, 'Rodgers': 2},
                         get_player_round_dict(drafted_teams))

    def test_get_user_round_dict(self):
        user_list = [['Saquon', 'Odell', 'Eli'], ['Sterling'], [], ['Evan Engram']]
        self.assertEqual({'Saquon': 1, 'Odell': 1, 'Eli': 1, 'Sterling': 2, 'Evan Engram': 4},
                         get_user_round_dict(user_list))

    def test_calculate_frequencies(self):
        player_list = ['Saquon', 'Odell', 'Saquon', 'Sterling', 'Saquon']
        self.assertEqual({'Saquon': 60.0, 'Odell': 20.0, 'Sterling': 20.0}, calculate_frequencies(player_list))

    def test_get_frequencies(self):
        drafted_teams = [['Saquon', 'Odell'], ['Saquon', 'Sterling'], ['Odell', 'Sterling'], ['Saquon', 'Eli']]
        user_round_dict = {'Saquon': 1, 'Odell': 1, 'Eli': 1, 'Sterling': 2}
        self.assertEqual({'Saquon': 75.0, 'Odell': 25.0, 'Sterling': 50.0, 'Eli': 0},
                         get_frequencies(drafted_teams, user_round_dict, 2))

    def test_get_all_sorted_freq(self):
        draft_freqs = {'Golden Tate': 50.0, 'Evan Engram': 80.0, 'Eli Manning': 25.0, 'Sterling Shepard': 90.0}
        round_dict = {'Golden Tate': 1, 'Evan Engram': 1, 'Eli Manning': 1, 'Sterling Shepard': 2}
        self.assertEqual(['Evan Engram', 'Golden Tate', 'Eli Manning', 'Sterling Shepard'],
                         get_sorted_players(draft_freqs, round_dict))

    def test_get_expected_team(self):
        draft_freqs = {'Golden Tate': 50.0, 'Evan Engram': 80.0, 'Eli Manning': 25.0, 'Sterling Shepard': 15.0,
                       'Travis Kelce': 65.0, 'Saquon Barkley': 85.0, 'Zach Ertz': 59.0}
        round_dict = {'Golden Tate': 4, 'Evan Engram': 2, 'Eli Manning': 2, 'Sterling Shepard': 3,
                      'Travis Kelce': 3, 'Saquon Barkley': 1, 'Zach Ertz': 3}
        self.assertEqual(['Saquon Barkley', 'Evan Engram', 'Travis Kelce', 'Golden Tate'],
                         get_expected_team(draft_freqs, top300dict, round_dict, 4))

    def test_get_expected_team_invalid_choices(self):
        draft_freqs = {'Patrick Mahomes': 80.0, 'Eli Manning': 25.0, 'Carson Wentz': 65.0, 'Aaron Rodgers': 40.0,
                       'Travis Kelce': 15.0, 'Drew Brees': 85.0, 'Zach Ertz': 59.0, 'Saquon Barkley': 69.0}
        round_dict = {'Aaron Rodgers': 4, 'Patrick Mahomes': 2, 'Eli Manning': 2, 'Carson Wentz': 3,
                      'Travis Kelce': 3, 'Drew Brees': 1, 'Zach Ertz': 3, 'Saquon Barkley': 5}
        self.assertEqual(['Drew Brees', 'Patrick Mahomes', 'Zach Ertz', 'Saquon Barkley'],
                         get_expected_team(draft_freqs, top300dict, round_dict, 5))

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
