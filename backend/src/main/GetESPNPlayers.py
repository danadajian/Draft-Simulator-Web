from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from bs4 import BeautifulSoup


def get_players_from_page(driver):
    WebDriverWait(driver, 30).until(ec.visibility_of_all_elements_located((By.CLASS_NAME, 'truncate')))
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')
    ranks = soup.find_all('div', class_='jsx-2810852873 table--cell ranking tar')
    rank_list = [rank.get_text() for rank in ranks]
    players = soup.find_all('a', class_='link clr-link pointer')
    player_list = [player.get_text() for player in players]
    teams = soup.find_all('span', class_='jsx-1705908198 pro-team-name fw-normal')
    team_list = [team.get_text() for team in teams]
    positions = soup.find_all('span', class_='playerinfo__playerpos ttu')
    pos_list = [position.get_text() for position in positions]
    player_dict = [
        {
            'Rank': rank_list[i],
            'Name': player_list[i],
            'Position': pos_list[i],
            'Team': team_list[i]
        }
        for i in range(len(rank_list))]
    return player_dict


def get_espn_players(driver):
    url = 'https://fantasy.espn.com/football/players/projections'
    driver.get(url)
    full_player_dict = []
    for i in range(6):
        player_dict = get_players_from_page(driver)
        full_player_dict = full_player_dict + player_dict
        next_button = driver.find_elements_by_xpath("//a[text()='" + str(i + 2) + "']")
        next_button[0].click()
    return full_player_dict
