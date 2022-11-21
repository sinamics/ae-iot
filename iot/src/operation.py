from main import HeatController
import RPi.GPIO as GPIO
from mqtt import MqttPublish
from datetime import datetime, date, timedelta
# from pprint import pprint
import json
import psutil
import time
import sys
import pytz

mqtt = MqttPublish()

# This script is executed from conjob. 
# crontab -e
#
# instantiate new class
HeatCtl = HeatController()

# read yaml config file
config = HeatCtl.read_config()

# gpio setup
GPIO.setmode(GPIO.BOARD) # use board pin number and not BCM chip numbers
GPIO.setwarnings(False)
GPIO.setup(config["fuel_gpio_output_pin"], GPIO.OUT)
GPIO.setup(config["electric_gpio_output_pin"], GPIO.OUT)


# valdiate that we have usable data
if not HeatCtl.validate_data():
    raise AttributeError('Data validation did not pass. Make sure this device has internet access.')

# Get current kwh price
spot_kwh_price = HeatCtl.get_current_hour_price()

if not config["fuel_kwh_price"]:
    raise AttributeError('fuel_kwh_price not defined in config!')

if not spot_kwh_price:
    raise AttributeError('spot_kwh_price not valid!')

print("electric kwh price is {} ( Øre )".format(spot_kwh_price))

forcast = HeatCtl.forcast()

# now = datetime.utcnow().replace(tzinfo=pytz.utc)
# if now-timedelta(hours=24) <= forcast["electric_time_to_start"] <= now:
#     print("within this hour")
def date_formatter(date):
    now = datetime.utcnow().replace(tzinfo=pytz.utc)
    if not date:
        return "not today"

    if now-timedelta(hours=24) <= date <= now:
        return "Now"

    return str(date - now).split(".")[0]

# sys.exit()
# create dict
pub_message = dict({
    "datetime": datetime.now(),
    "system": HeatCtl.hostname,
    "iot-device": config["client_id"],
    "friendly_name": config["friendly_name"],
    "heater": None,
    "electric_time_to_start": date_formatter(forcast["electric_time_to_start"]),
    "fuel_time_to_start": date_formatter(forcast["fuel_time_to_start"]),
    "fuel_price": config["fuel_kwh_price"],
    "electric_price": spot_kwh_price,
    "uptime": str(timedelta(seconds=time.time() - psutil.boot_time())).split(".")[0]
})

if spot_kwh_price < config["fuel_kwh_price"]:
    print("Prioritizes electric heating")
    # trigger rpi pin
    GPIO.output(config["electric_gpio_output_pin"], GPIO.HIGH)
    GPIO.output(config["fuel_gpio_output_pin"], GPIO.LOW)
    # get status
    #print(GPIO.input(config["electric_gpio_output_pin"]))
    
    pub_message["heater"] = "electric"

else:
    print("Prioritizes fuel heating")
    # trigger rpi pin
    GPIO.output(config["electric_gpio_output_pin"], GPIO.LOW)
    GPIO.output(config["fuel_gpio_output_pin"], GPIO.HIGH)

    pub_message["heater"] = "fuel"

# pprint(pub_message)
mqtt.publish(json.dumps(pub_message, indent=4, sort_keys=True, default=str))
