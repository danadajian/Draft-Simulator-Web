import hashlib
import requests
import time
import datetime
import os

try:
    from backend.src.main.apiCredentials import *
except ImportError:
    print()

is_production = os.environ.get('IS_HEROKU', None)
if is_production:
    api_key = os.environ.get('API_KEY')
    api_secret = os.environ.get('API_SECRET')
else:
    api_key = api_key_from_credentials
    api_secret = api_secret_from_credentials


def call_api(endpoint, extra_params):
    timestamp = repr(int(time.time()))
    encoded_string = str.encode(api_key + api_secret + timestamp)
    signature = hashlib.sha256(encoded_string).hexdigest()
    params = 'accept=json&api_key=' + api_key + '&sig=' + signature + extra_params
    url = 'http://api.stats.com/v1/' + endpoint + '?' + params
    response = requests.get(url)
    if response.status_code == 404:
        return '404 error'
    elif response.status_code != 200:
        print(response.status_code)
        raise ConnectionError
    return response.json()


def is_offseason(league):
    sport = 'baseball' if league == 'mlb' else 'basketball' if league == 'nba' else 'football' if league == 'nfl' else None
    season_structure = call_api('decode/' + sport + '/' + league + '/seasonStructure/', '')
    try:
        event_types = season_structure.get('apiResults')[0].get('league').get('seasons')[0].get('eventType')
        date_ranges = [
            [
                datetime.datetime(event_type.get('startDate').get('year'), event_type.get('startDate').get('month'), event_type.get('startDate').get('date')),
                datetime.datetime(event_type.get('endDate').get('year'), event_type.get('endDate').get('month'), event_type.get('endDate').get('date'))
            ]
            for event_type in event_types]
        dates = [date for date_range in date_ranges for date in date_range]
        now = datetime.datetime.now()
        return now < min(sorted(dates)) or now > max(sorted(dates))
    except AttributeError:
        return True
