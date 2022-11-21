import sys
import nordpool.elspot as nordpool
from pprint import pprint
from datetime import datetime, date, timedelta
from os.path import exists
import socket
import pytz
import json
import yaml
import os

utc_tz = pytz.utc

class HeatController(object):
    def __init__(self, *args, **kwargs):
        self.config = self.read_config()
        self.hostname = socket.gethostname()
        
    def validate_data(self):
        nordpool_data = self.load_pricefile()
        expected_keys = self.config["data_nested_path"].split("_")
        print("validating data at {}".format(datetime.now()))

        if not self.keys_exists(nordpool_data, *expected_keys) or not self.get_current_hour_price():
            return self.fetch_prices()

        return True

    def keys_exists(self, element, *keys):
        '''
        Check if *keys (nested) exists in `element` (dict).
        '''

        if not isinstance(element, dict):
            raise AttributeError('keys_exists() expects dict as first argument.')
        if len(keys) == 0:
            raise AttributeError('keys_exists() expects at least two arguments, one given.')

        _element = element
        for key in keys:
            try:
                _element = _element[key]
            except KeyError:
                print("validation failed!, keys does not exist in element. Check your data_nested_path config entry")
                return False
        
        return True

    def read_config(self):
        with open(os.path.expanduser('/app/config.yaml'), "r") as yamlfile:
            return yaml.load(yamlfile, Loader=yaml.FullLoader)

    def fetch_prices(self, *args):
        # fetching prices
        spot_price = nordpool.Prices("NOK").hourly(areas=[self.config["nordpool_region"]],end_date=date.today())
        
        try:
            with open(os.path.expanduser('/app/todays_prices.json'), "w") as outfile:
                outfile.write(json.dumps(spot_price, indent=4, sort_keys=True, default=str))
            return True
        except KeyError:
            return False
        
    def load_pricefile(self, *args):
        # check if file exist and if not, fetch new prices. ( probably first run )
        if not exists(os.path.expanduser('/app/todays_prices.json')):
            self.fetch_prices()

        # Load file with todays prices
        with open(os.path.expanduser('/app/todays_prices.json'), 'r') as openfile:   
            # Reading from json file
            return json.load(openfile)

    def get_current_hour_price(self):
        prices = self.load_pricefile()
        for r in prices["areas"][self.config["nordpool_region"]]["values"]:
            start_pricetime = datetime.strptime(r["start"], '%Y-%m-%d %H:%M:%S%z').replace(tzinfo=utc_tz)
            end_pricetime = datetime.strptime(r["end"], '%Y-%m-%d %H:%M:%S%z').replace(tzinfo=utc_tz)

            now = datetime.utcnow().replace(tzinfo=utc_tz)
            if now >= start_pricetime and now <= end_pricetime:
                if "value" in r:
                    return int(r["value"]) / 10 # convert to Norwegian Øre/kwh, prices from nordpool is calculated in Øre/MWh.

        # we can assume no data for this hour was found. Return false
        return False

    def forcast(self):
        prices = self.load_pricefile()
        electric_time_to_start = None
        fuel_time_to_start = None

        el_time_set = False
        fuel_time_set = False

        for r in prices["areas"][self.config["nordpool_region"]]["values"]:
            if "value" and "start" and "end" in r:
                start_pricetime = datetime.strptime(r["start"], '%Y-%m-%d %H:%M:%S%z').replace(tzinfo=utc_tz)
                end_pricetime = datetime.strptime(r["end"], '%Y-%m-%d %H:%M:%S%z').replace(tzinfo=utc_tz)
                
                el_price = float(r["value"]) / 10
                fuel_price = self.config["fuel_kwh_price"]

                now = datetime.utcnow().replace(tzinfo=utc_tz)
                if now <= end_pricetime:
                    if el_price >= fuel_price:
                        if fuel_time_set:
                            continue
                        fuel_time_to_start = start_pricetime
                        fuel_time_set = True

                    if el_price < fuel_price:
                        if el_time_set:
                            continue
                        electric_time_to_start = start_pricetime
                        el_time_set = True

                if el_time_set and fuel_time_set:
                    break
            else:
                return "Price data corrupted!"
                break

        return {
            "electric_time_to_start": electric_time_to_start,
            "fuel_time_to_start": fuel_time_to_start,
        }


    def get_tomorrow(self, *args):
        return nordpool.Prices("NOK").hourly(areas=[self.config["nordpool_region"]],end_date=date.today() + timedelta(days=1))
