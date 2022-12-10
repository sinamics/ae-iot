import nordpool.elspot as nordpool
from pprint import pprint
from datetime import datetime, date, timedelta
from os.path import exists
from redis_db import r
import socket
import pytz
import json
import yaml
import os

utc_tz = pytz.utc

class HeatController(object):
    def __init__(self, *args, **kwargs):
        self.hostname = socket.gethostname()
        self.redis_config = dict()
        self.debug = False
        self.r = r

        # seed redis db 
        self.seed()

    def seed(self):
        # with open(os.path.expanduser('../config.yaml'), "r") as yamlfile:
        with open(os.path.expanduser('/ae-iot/iot/config.yaml'), "r") as yamlfile:
            config_yaml_file = yaml.load(yamlfile, Loader=yaml.FullLoader)

        update_values = dict({
                        "client_id": config_yaml_file["client_id"],
                        "friendly_name": config_yaml_file["friendly_name"],
                        "datetime": datetime.now(),
                        "system": self.hostname,
                    })
                        
        config_yaml_file.update(update_values)      
        redis_config = self.redis_config_values()

        if not redis_config:
            r.set("iot/config", json.dumps(config_yaml_file, indent=4, sort_keys=True, default=str))
        else:
            # validate stored values is correct 
            for line in config_yaml_file:
                if line == "debug":
                    self.debug = config_yaml_file[line]
                    if config_yaml_file[line] != redis_config[line]:
                        redis_config[line] = config_yaml_file[line]
                        r.set("iot/config", json.dumps(redis_config, indent=4, sort_keys=True, default=str))

                if line not in redis_config:
                    print("{} does not exsist in redis, lets add it".format(line))
                    redis_config[line] = config_yaml_file[line]
                    r.set("iot/config", json.dumps(redis_config, indent=4, sort_keys=True, default=str))
                 
        # r.delete("{}/config".format(self.redis_config_values()["client_id"]))    
        self.redis_config.update(config_yaml_file)



    def validate_data(self):
        nordpool_data = self.load_pricefile()
        expected_keys = self.redis_config_values()["data_nested_path"].split("_")
        if self.debug:
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

    def redis_config_values(self):
        return json.loads(self.r.get("iot/config"))

    def update_redis_config_values(self, obj):
        try:
            json.loads(obj)
        except:
            print("invalid object received!, main ->  update_redis_config_values")
            return
        
        config = self.redis_config_values()
        config.update(obj)
        r.set("iot/config", json.dumps(config, indent=4, sort_keys=True, default=str))


    def fetch_prices(self, *args):
        # fetching prices
        try:
             spot_price = nordpool.Prices("NOK").hourly(areas=[self.redis_config_values()["nordpool_region"]],end_date=date.today())
        except:
            print("Could not fetch data from nordpool!!")
            return False
       
        
        try:
            with open(os.path.expanduser('todays_prices.json'), "w") as outfile:
                outfile.write(json.dumps(spot_price, indent=4, sort_keys=True, default=str))
            return True
        except KeyError:
            return False
        
    def load_pricefile(self, *args):
        # check if file exist and if not, fetch new prices. ( probably first run )
        if not exists(os.path.expanduser('todays_prices.json')):
            self.fetch_prices()

        # Load file with todays prices
        with open(os.path.expanduser('todays_prices.json'), 'r') as openfile:   
            # Reading from json file
            return json.load(openfile)

    def get_current_hour_price(self):
        prices = self.load_pricefile()
        for r in prices["areas"][self.redis_config_values()["nordpool_region"]]["values"]:
            start_pricetime = datetime.strptime(r["start"], '%Y-%m-%d %H:%M:%S%z').replace(tzinfo=utc_tz)
            end_pricetime = datetime.strptime(r["end"], '%Y-%m-%d %H:%M:%S%z').replace(tzinfo=utc_tz)

            now = datetime.utcnow().replace(tzinfo=utc_tz)
            if now >= start_pricetime and now <= end_pricetime:
                if "value" in r:
                    return round(float(r["value"]) / 10 * 1.25, 1) # convert to Norwegian Øre/kwh, prices from nordpool is calculated in Øre/MWh.

        # we can assume no data for this hour was found. Return false
        return False

    def forcast(self):
        prices = self.load_pricefile()
        electric_time_to_start = None
        fuel_time_to_start = None

        el_time_set = False
        fuel_time_set = False

        for r in prices["areas"][self.redis_config_values()["nordpool_region"]]["values"]:
            if "value" and "start" and "end" in r:
                start_pricetime = datetime.strptime(r["start"], '%Y-%m-%d %H:%M:%S%z').replace(tzinfo=utc_tz)
                end_pricetime = datetime.strptime(r["end"], '%Y-%m-%d %H:%M:%S%z').replace(tzinfo=utc_tz)
                
                el_price = float(r["value"]) / 10 * 1.25
                fuel_price = self.redis_config_values()["fuel_price"]

                if not fuel_price:
                    return print("Invalid fuel price")
                now = datetime.utcnow().replace(tzinfo=utc_tz)
                if end_pricetime >= now :
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
        return nordpool.Prices("NOK").hourly(areas=[self.redis_config_values()["nordpool_region"]],end_date=date.today() + timedelta(days=1))
