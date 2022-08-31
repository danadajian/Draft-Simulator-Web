import json
from random import *


def position_count(player_list, pos_dict, pos):
    result = [player for player in player_list if pos_dict.get(player) == pos]
    return len(result)


def is_valid_choice(player, pos_dict, team):
    if player and player not in team:
        pos_limits = {'QB': 2, 'RB': 5, 'WR': 5, 'TE': 2, 'D/ST': 1, 'K': 1}
        player_pos = pos_dict.get(player)
        if player_pos and position_count(team, pos_dict, player_pos) < pos_limits.get(player_pos):
            return True
    return False


def create_teams(team_count):
    team_dict = {}
    for i in range(team_count - 1):
        n = i + 2
        team_dict['team_%s' % n] = []
    team_dict.update({'user_team': []})
    return team_dict


def set_draft_order(team_dict, pick_order):
    draft_order = [team for team in team_dict.keys()]
    if pick_order == 0:
        shuffle(draft_order)
    else:
        user_index = draft_order.index('user_team')
        draft_order[user_index], draft_order[pick_order - 1] = draft_order[pick_order - 1], draft_order[user_index]
    return draft_order


def select_next_pick(player_list, pos_dict, team, pick_range):
    pick_choices = []
    for _ in range(pick_range):
        pick = next((player for player in player_list
                     if is_valid_choice(player, pos_dict, team) and player not in pick_choices), None)
        if not pick and not pick_choices:
            return None
        elif pick:
            pick_choices.append(pick)
    return choice(pick_choices)


def pick_players(user_list, team_dict, pos_dict, draft_order, round_count):
    player_list = list(pos_dict.keys())
    round_index = 0
    while round_index < round_count:
        user_round_list = user_list[round_index] if round_index < len(user_list) else None
        for team in draft_order:
            if team == 'user_team' and user_round_list:
                next_pick = select_next_pick(user_round_list, pos_dict, team_dict.get(team), 1)
            else:
                next_pick = select_next_pick(player_list, pos_dict, team_dict.get(team), 3)
            if not next_pick:
                raise RuntimeError
            team_dict.get(team).append(next_pick)
            player_list.remove(next_pick)
            for round_list in user_list:
                if next_pick in round_list:
                    round_list.remove(next_pick)
        draft_order = draft_order[::-1]
        round_index += 1
    return team_dict.get('user_team')


def simulate_draft(user_player_list, pos_dict, team_count, pick_order, round_count, simulations):
    drafted_teams = []
    for _ in range(simulations):
        user_list = [[player for player in user_round_list] for user_round_list in user_player_list]
        team_dict = create_teams(team_count)
        draft_order = set_draft_order(team_dict, pick_order)
        drafted_team = pick_players(user_list, team_dict, pos_dict, draft_order, round_count)
        drafted_teams.append(drafted_team)
    return drafted_teams


def get_player_round_dict(drafted_teams):
    player_round_dict = {player: team.index(player) + 1 for team in drafted_teams for player in team}
    return player_round_dict


def get_user_round_dict(user_list):
    user_round_dict = {player: user_list.index(round_list) + 1 for round_list in user_list for player in round_list}
    return user_round_dict


def calculate_frequencies(player_list):
    frequencies = {}
    for player in player_list:
        if player in frequencies.keys():
            frequencies[player] += 1
        else:
            frequencies[player] = 1
    for key, value in frequencies.items():
        frequencies[key] = 100 * value / len(player_list)
    return frequencies


def get_frequencies(drafted_teams, user_round_dict, round_count):
    picks_by_round = []
    round_index = 0
    while round_index < round_count:
        picks_this_round = [team[round_index] for team in drafted_teams]
        picks_by_round.append(picks_this_round)
        round_index += 1
    all_draft_frequencies, matched_players = {}, []
    for round_picks in picks_by_round:
        frequencies = calculate_frequencies(round_picks)
        for player in frequencies.keys():
            if user_round_dict.get(player) == picks_by_round.index(round_picks) + 1:
                matched_players.append(player)
        all_draft_frequencies.update(frequencies)
    for player in all_draft_frequencies.keys():
        if user_round_dict.get(player) and player not in matched_players:
            all_draft_frequencies[player] = 0
    return all_draft_frequencies


def get_sorted_players(freq_dict, round_dict):
    sorted_players = sorted(freq_dict, key=lambda item: (round_dict.get(item), -freq_dict.get(item)))
    return sorted_players


def get_expected_team(draft_frequencies, pos_dict, round_dict, round_count):
    expected_team = []
    current_round = 1
    while current_round <= round_count:
        freq_this_round = {player: draft_frequencies.get(player) for player, draft_round in round_dict.items()
                           if draft_round == current_round}
        most_to_least_drafted_this_round = sorted(freq_this_round, key=freq_this_round.__getitem__, reverse=True)
        player = next((player for player in most_to_least_drafted_this_round
                       if is_valid_choice(player, pos_dict, expected_team)), None)
        if player:
            expected_team.append(player)
        current_round += 1
    return expected_team


def order_expected_team_and_assign_positions(team, pos_dict):
    starting_lineup = [''] * 9
    bench = []
    new_position_dict = {}
    position_order = ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'RB WR TE', 'DST', 'K']
    for player in team:
        position = pos_dict.get(player)
        player_index = next((position_order.index(spot) for spot in position_order if position in spot), -1)
        if player_index == -1:
            bench.append(player)
            new_position_dict.update({player: 'BE'})
        else:
            starting_lineup[player_index] = player
            position_order[player_index] = ''
            new_position_dict.update({player: 'FLEX' if player_index == 6 else position})
    ordered_team = [player for player in starting_lineup if player]
    full_team = ordered_team + bench
    ordered_team_dict = {player: new_position_dict.get(player) for player in full_team}
    return ordered_team_dict


def jsonify(player_list, pos_dict, team_dict, round_dict, freq_dict):
    freq_list = [{'Name': player,
                  'Position': pos_dict.get(player),
                  'Team': team_dict.get(player),
                  'Round': round_dict.get(player),
                  'Frequency': str(freq_dict.get(player)) + '%'}
                 for player in player_list]
    return freq_list


def get_draft_results(user_list, player_dict, team_count, pick_order, round_count):
    pos_dict = {player.get('player'): player.get('position') for player in player_dict}
    team_dict = {player.get('player'): player.get('team') for player in player_dict}
    teams_drafted = simulate_draft(user_list, pos_dict, team_count, pick_order, round_count, 1000)
    user_round_dict = get_user_round_dict(user_list)
    actual_round_dict = get_player_round_dict(teams_drafted)
    freq_dict = get_frequencies(teams_drafted, user_round_dict, round_count)
    user_freq_dict = {player: freq_dict.get(player) if freq_dict.get(player) else 0
                      for round_list in user_list for player in round_list}
    user_players_sorted = get_sorted_players(user_freq_dict, user_round_dict)
    all_players_sorted = get_sorted_players(freq_dict, actual_round_dict)
    expected_team = get_expected_team(freq_dict, pos_dict, actual_round_dict, round_count)
    expected_team_dict = order_expected_team_and_assign_positions(expected_team, pos_dict)
    jsonified_user_frequencies = jsonify(user_players_sorted, pos_dict, team_dict, user_round_dict, user_freq_dict)
    jsonified_frequencies = jsonify(all_players_sorted, pos_dict, team_dict, actual_round_dict, freq_dict)
    jsonified_expected_team = jsonify(
        expected_team_dict.keys(), expected_team_dict, team_dict, actual_round_dict, freq_dict)
    draft_results = {'UserFrequencies': jsonified_user_frequencies,
                     'AllFrequencies': jsonified_frequencies,
                     'ExpectedTeam': jsonified_expected_team}
    return draft_results



draft_results = get_draft_results(
    user_list=[
        ['Najee Harris'],
        ['Leonard Fournette'],
    ],
    player_dict=[{"player":"Jonathan Taylor","team":"Colts","position":"RB"},{"player":"Christian McCaffrey","team":"Panthers","position":"RB"},{"player":"Cooper Kupp","team":"Rams","position":"WR"},{"player":"Austin Ekeler","team":"Chargers","position":"RB"},{"player":"Justin Jefferson","team":"Vikings","position":"WR"},{"player":"Ja'Marr Chase","team":"Bengals","position":"WR"},{"player":"Derrick Henry","team":"Titans","position":"RB"},{"player":"Najee Harris","team":"Steelers","position":"RB"},{"player":"Dalvin Cook","team":"Vikings","position":"RB"},{"player":"Davante Adams","team":"Raiders","position":"WR"},{"player":"Deebo Samuel","team":"49ers","position":"WR"},{"player":"Stefon Diggs","team":"Bills","position":"WR"},{"player":"CeeDee Lamb","team":"Cowboys","position":"WR"},{"player":"D'Andre Swift","team":"Lions","position":"RB"},{"player":"Joe Mixon","team":"Bengals","position":"RB"},{"player":"Alvin Kamara","team":"Saints","position":"RB"},{"player":"Tyreek Hill","team":"Dolphins","position":"WR"},{"player":"Leonard Fournette","team":"Buccaneers","position":"RB"},{"player":"Javonte Williams","team":"Broncos","position":"RB"},{"player":"Mark Andrews","team":"Ravens","position":"TE"},{"player":"James Conner","team":"Cardinals","position":"RB"},{"player":"Aaron Jones","team":"Packers","position":"RB"},{"player":"Cam Akers","team":"Rams","position":"RB"},{"player":"Travis Kelce","team":"Chiefs","position":"TE"},{"player":"Keenan Allen","team":"Chargers","position":"WR"},{"player":"Tee Higgins","team":"Bengals","position":"WR"},{"player":"DJ Moore","team":"Panthers","position":"WR"},{"player":"Saquon Barkley","team":"Giants","position":"RB"},{"player":"Nick Chubb","team":"Browns","position":"RB"},{"player":"Mike Evans","team":"Buccaneers","position":"WR"},{"player":"Jaylen Waddle","team":"Dolphins","position":"WR"},{"player":"Michael Pittman Jr.","team":"Colts","position":"WR"},{"player":"David Montgomery","team":"Bears","position":"RB"},{"player":"J.K. Dobbins","team":"Ravens","position":"RB"},{"player":"Breece Hall","team":"Jets","position":"RB"},{"player":"Ezekiel Elliott","team":"Cowboys","position":"RB"},{"player":"A.J. Brown","team":"Eagles","position":"WR"},{"player":"Terry McLaurin","team":"Commanders","position":"WR"},{"player":"Diontae Johnson","team":"Steelers","position":"WR"},{"player":"Josh Jacobs","team":"Raiders","position":"RB"},{"player":"Antonio Gibson","team":"Commanders","position":"RB"},{"player":"Josh Allen","team":"Bills","position":"QB"},{"player":"Mike Williams","team":"Chargers","position":"WR"},{"player":"Brandin Cooks","team":"Texans","position":"WR"},{"player":"Marquise Brown","team":"Cardinals","position":"WR"},{"player":"DK Metcalf","team":"Seahawks","position":"WR"},{"player":"Jerry Jeudy","team":"Broncos","position":"WR"},{"player":"Patrick Mahomes","team":"Chiefs","position":"QB"},{"player":"Courtland Sutton","team":"Broncos","position":"WR"},{"player":"Kyle Pitts","team":"Falcons","position":"TE"},{"player":"Travis Etienne Jr.","team":"Jaguars","position":"RB"},{"player":"Chris Godwin","team":"Buccaneers","position":"WR"},{"player":"Amon-Ra St. Brown","team":"Lions","position":"WR"},{"player":"Darnell Mooney","team":"Bears","position":"WR"},{"player":"Justin Herbert","team":"Chargers","position":"QB"},{"player":"Amari Cooper","team":"Browns","position":"WR"},{"player":"Gabriel Davis","team":"Bills","position":"WR"},{"player":"Michael Thomas","team":"Saints","position":"WR"},{"player":"Elijah Mitchell","team":"49ers","position":"RB"},{"player":"Miles Sanders","team":"Eagles","position":"RB"},{"player":"Devin Singletary","team":"Bills","position":"RB"},{"player":"Cordarrelle Patterson","team":"Falcons","position":"RB"},{"player":"Darren Waller","team":"Raiders","position":"TE"},{"player":"George Kittle","team":"49ers","position":"TE"},{"player":"Allen Robinson II","team":"Rams","position":"WR"},{"player":"Hunter Renfrow","team":"Raiders","position":"WR"},{"player":"Adam Thielen","team":"Vikings","position":"WR"},{"player":"Drake London","team":"Falcons","position":"WR"},{"player":"Rashod Bateman","team":"Ravens","position":"WR"},{"player":"Lamar Jackson","team":"Ravens","position":"QB"},{"player":"Dalton Schultz","team":"Cowboys","position":"TE"},{"player":"JuJu Smith-Schuster","team":"Chiefs","position":"WR"},{"player":"Tyler Lockett","team":"Seahawks","position":"WR"},{"player":"DeVonta Smith","team":"Eagles","position":"WR"},{"player":"Kadarius Toney","team":"Giants","position":"WR"},{"player":"Kareem Hunt","team":"Browns","position":"RB"},{"player":"Clyde Edwards-Helaire","team":"Chiefs","position":"RB"},{"player":"Damien Harris","team":"Patriots","position":"RB"},{"player":"Kyler Murray","team":"Cardinals","position":"QB"},{"player":"Jalen Hurts","team":"Eagles","position":"QB"},{"player":"Dak Prescott","team":"Cowboys","position":"QB"},{"player":"Tom Brady","team":"Buccaneers","position":"QB"},{"player":"Aaron Rodgers","team":"Packers","position":"QB"},{"player":"Joe Burrow","team":"Bengals","position":"QB"},{"player":"Russell Wilson","team":"Broncos","position":"QB"},{"player":"T.J. Hockenson","team":"Lions","position":"TE"},{"player":"Christian Kirk","team":"Jaguars","position":"WR"},{"player":"Garrett Wilson","team":"Jets","position":"WR"},{"player":"Elijah Moore","team":"Jets","position":"WR"},{"player":"Allen Lazard","team":"Packers","position":"WR"},{"player":"DeAndre Hopkins","team":"Cardinals","position":"WR"},{"player":"Brandon Aiyuk","team":"49ers","position":"WR"},{"player":"Chase Claypool","team":"Steelers","position":"WR"},{"player":"Robert Woods","team":"Titans","position":"WR"},{"player":"Tony Pollard","team":"Cowboys","position":"RB"},{"player":"Rhamondre Stevenson","team":"Patriots","position":"RB"},{"player":"AJ Dillon","team":"Packers","position":"RB"},{"player":"Chase Edmonds","team":"Dolphins","position":"RB"},{"player":"James Robinson","team":"Jaguars","position":"RB"},{"player":"Matthew Stafford","team":"Rams","position":"QB"},{"player":"Trey Lance","team":"49ers","position":"QB"},{"player":"Dallas Goedert","team":"Eagles","position":"TE"},{"player":"Zach Ertz","team":"Cardinals","position":"TE"},{"player":"Mike Gesicki","team":"Dolphins","position":"TE"},{"player":"Pat Freiermuth","team":"Steelers","position":"TE"},{"player":"Rashaad Penny","team":"Seahawks","position":"RB"},{"player":"Kenneth Walker III","team":"Seahawks","position":"RB"},{"player":"Chris Olave","team":"Saints","position":"WR"},{"player":"Treylon Burks","team":"Titans","position":"WR"},{"player":"Kenny Golladay","team":"Giants","position":"WR"},{"player":"Jakobi Meyers","team":"Patriots","position":"WR"},{"player":"Skyy Moore","team":"Chiefs","position":"WR"},{"player":"Russell Gage","team":"Buccaneers","position":"WR"},{"player":"Tyler Boyd","team":"Bengals","position":"WR"},{"player":"James Cook","team":"Bills","position":"RB"},{"player":"Michael Carter","team":"Jets","position":"RB"},{"player":"Melvin Gordon III","team":"Broncos","position":"RB"},{"player":"Nyheim Hines","team":"Colts","position":"RB"},{"player":"Hunter Henry","team":"Patriots","position":"TE"},{"player":"Dawson Knox","team":"Bills","position":"TE"},{"player":"Noah Fant","team":"Seahawks","position":"TE"},{"player":"Cole Kmet","team":"Bears","position":"TE"},{"player":"Derek Carr","team":"Raiders","position":"QB"},{"player":"Kirk Cousins","team":"Vikings","position":"QB"},{"player":"Jarvis Landry","team":"Saints","position":"WR"},{"player":"Jahan Dotson","team":"Commanders","position":"WR"},{"player":"Mecole Hardman","team":"Chiefs","position":"WR"},{"player":"Marquez Valdes-Scantling","team":"Chiefs","position":"WR"},{"player":"DJ Chark","team":"Lions","position":"WR"},{"player":"Joshua Palmer","team":"Chargers","position":"WR"},{"player":"Robbie Anderson","team":"Panthers","position":"WR"},{"player":"Irv Smith Jr.","team":"Vikings","position":"TE"},{"player":"David Njoku","team":"Browns","position":"TE"},{"player":"Tyler Higbee","team":"Rams","position":"TE"},{"player":"Trevor Lawrence","team":"Jaguars","position":"QB"},{"player":"Tua Tagovailoa","team":"Dolphins","position":"QB"},{"player":"Marvin Jones Jr.","team":"Jaguars","position":"WR"},{"player":"Dameon Pierce","team":"Texans","position":"RB"},{"player":"J.D. McKissic","team":"Commanders","position":"RB"},{"player":"Raheem Mostert","team":"Dolphins","position":"RB"},{"player":"Bills D/ST","team":"Bills","position":"D/ST"},{"player":"Saints D/ST","team":"Saints","position":"D/ST"},{"player":"Packers D/ST","team":"Packers","position":"D/ST"},{"player":"Ravens D/ST","team":"Ravens","position":"D/ST"},{"player":"49ers D/ST","team":"49ers","position":"D/ST"},{"player":"Buccaneers D/ST","team":"Buccaneers","position":"D/ST"},{"player":"Cowboys D/ST","team":"Cowboys","position":"D/ST"},{"player":"Colts D/ST","team":"Colts","position":"D/ST"},{"player":"Commanders D/ST","team":"Commanders","position":"D/ST"},{"player":"Steelers D/ST","team":"Steelers","position":"D/ST"},{"player":"Justin Tucker","team":"Ravens","position":"K"},{"player":"Evan McPherson","team":"Bengals","position":"K"},{"player":"Matt Gay","team":"Rams","position":"K"},{"player":"Harrison Butker","team":"Chiefs","position":"K"},{"player":"Daniel Carlson","team":"Raiders","position":"K"},{"player":"Brandon McManus","team":"Broncos","position":"K"},{"player":"Nick Folk","team":"Patriots","position":"K"},{"player":"Tyler Bass","team":"Bills","position":"K"},{"player":"Matt Prater","team":"Cardinals","position":"K"},{"player":"Graham Gano","team":"Giants","position":"K"},{"player":"Marlon Mack","team":"Texans","position":"RB"},{"player":"DeVante Parker","team":"Patriots","position":"WR"},{"player":"Jalen Tolbert","team":"Cowboys","position":"WR"},{"player":"Justin Fields","team":"Bears","position":"QB"},{"player":"Michael Gallup","team":"Cowboys","position":"WR"},{"player":"Rondale Moore","team":"Cardinals","position":"WR"},{"player":"Nico Collins","team":"Texans","position":"WR"},{"player":"Julio Jones","team":"Buccaneers","position":"WR"},{"player":"Van Jefferson","team":"Rams","position":"WR"},{"player":"Curtis Samuel","team":"Commanders","position":"WR"},{"player":"Isaiah Spiller","team":"Chargers","position":"RB"},{"player":"Evan Engram","team":"Jaguars","position":"TE"},{"player":"Jamaal Williams","team":"Lions","position":"RB"},{"player":"Alexander Mattison","team":"Vikings","position":"RB"},{"player":"Darrell Henderson Jr.","team":"Rams","position":"RB"},{"player":"Deshaun Watson","team":"Browns","position":"QB"},{"player":"Daniel Jones","team":"Giants","position":"QB"},{"player":"Christian Watson","team":"Packers","position":"WR"},{"player":"Wan'Dale Robinson","team":"Giants","position":"WR"},{"player":"Jameson Williams","team":"Lions","position":"WR"},{"player":"Cedrick Wilson Jr.","team":"Dolphins","position":"WR"},{"player":"Tyler Allgeier","team":"Falcons","position":"RB"},{"player":"Khalil Herbert","team":"Bears","position":"RB"},{"player":"Ronald Jones","team":"Chiefs","position":"RB"},{"player":"Austin Hooper","team":"Titans","position":"TE"},{"player":"Kenneth Gainwell","team":"Eagles","position":"RB"},{"player":"Sony Michel","team":"Dolphins","position":"RB"},{"player":"Hayden Hurst","team":"Bengals","position":"TE"},{"player":"Chargers D/ST","team":"Chargers","position":"D/ST"},{"player":"Browns D/ST","team":"Browns","position":"D/ST"},{"player":"Greg Joseph","team":"Vikings","position":"K"},{"player":"Jake Elliott","team":"Eagles","position":"K"},{"player":"Jamison Crowder","team":"Bills","position":"WR"},{"player":"Kenyan Drake","team":"Raiders","position":"RB"},{"player":"Jerick McKinnon","team":"Chiefs","position":"RB"},{"player":"Rachaad White","team":"Buccaneers","position":"RB"},{"player":"Mark Ingram II","team":"Saints","position":"RB"},{"player":"Rex Burkhead","team":"Texans","position":"RB"},{"player":"Darrel Williams","team":"Cardinals","position":"RB"},{"player":"Brian Robinson","team":"Commanders","position":"RB"},{"player":"Zamir White","team":"Raiders","position":"RB"},{"player":"Gus Edwards","team":"Ravens","position":"RB"},{"player":"Isaiah McKenzie","team":"Bills","position":"WR"},{"player":"Alec Pierce","team":"Colts","position":"WR"},{"player":"Kendrick Bourne","team":"Patriots","position":"WR"},{"player":"Chuba Hubbard","team":"Panthers","position":"RB"},{"player":"D'Onta Foreman","team":"Panthers","position":"RB"},{"player":"Hassan Haskins","team":"Titans","position":"RB"},{"player":"Tyrion Davis-Price","team":"49ers","position":"RB"},{"player":"D'Ernest Johnson","team":"Browns","position":"RB"},{"player":"Damien Williams","team":"Falcons","position":"RB"},{"player":"Samaje Perine","team":"Bengals","position":"RB"},{"player":"Dontrell Hilliard","team":"Titans","position":"RB"},{"player":"Albert Okwuegbunam","team":"Broncos","position":"TE"},{"player":"Carson Wentz","team":"Commanders","position":"QB"},{"player":"KJ Hamler","team":"Broncos","position":"WR"},{"player":"Nick Westbrook-Ikhine","team":"Titans","position":"WR"},{"player":"George Pickens","team":"Steelers","position":"WR"},{"player":"Zach Wilson","team":"Jets","position":"QB"},{"player":"Ryan Tannehill","team":"Titans","position":"QB"},{"player":"Dolphins D/ST","team":"Dolphins","position":"D/ST"},{"player":"Patriots D/ST","team":"Patriots","position":"D/ST"},{"player":"Cade York","team":"Browns","position":"K"},{"player":"Robbie Gould","team":"49ers","position":"K"},{"player":"Velus Jones Jr.","team":"Bears","position":"WR"},{"player":"Odell Beckham Jr.","team":"FA","position":"WR"},{"player":"Sterling Shepard","team":"Giants","position":"WR"},{"player":"Randall Cobb","team":"Packers","position":"WR"},{"player":"Corey Davis","team":"Jets","position":"WR"},{"player":"K.J. Osborn","team":"Vikings","position":"WR"},{"player":"A.J. Green","team":"Cardinals","position":"WR"},{"player":"Chris Conley","team":"Texans","position":"WR"},{"player":"Devin Duvernay","team":"Ravens","position":"WR"},{"player":"Parris Campbell","team":"Colts","position":"WR"},{"player":"Matt Breida","team":"Giants","position":"RB"},{"player":"Ty Montgomery","team":"Patriots","position":"RB"},{"player":"Boston Scott","team":"Eagles","position":"RB"},{"player":"Chris Evans","team":"Bengals","position":"RB"},{"player":"Ke'Shawn Vaughn","team":"Buccaneers","position":"RB"},{"player":"DeeJay Dallas","team":"Seahawks","position":"RB"},{"player":"Mike Davis","team":"Ravens","position":"RB"},{"player":"Eno Benjamin","team":"Cardinals","position":"RB"},{"player":"Jameis Winston","team":"Saints","position":"QB"},{"player":"Mac Jones","team":"Patriots","position":"QB"},{"player":"Matt Ryan","team":"Colts","position":"QB"},{"player":"Gerald Everett","team":"Chargers","position":"TE"},{"player":"Logan Thomas","team":"Commanders","position":"TE"},{"player":"Robert Tonyan","team":"Packers","position":"TE"},{"player":"Mo Alie-Cox","team":"Colts","position":"TE"},{"player":"Benny Snell Jr.","team":"Steelers","position":"RB"}],
    team_count=8,
    pick_order=2,
    round_count=16
)
print(json.dumps(draft_results.get('UserFrequencies'), indent=2))
print(json.dumps(draft_results.get('ExpectedTeam'), indent=2))
