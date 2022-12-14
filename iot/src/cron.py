from main import HeatController
import RPi.GPIO as GPIO
from mqtt_pub import MqttPublish
from datetime import datetime, date, timedelta
from pprint import pprint
import json
import psutil
import time
import sys
import pytz
import redis

# instantiate new mqtt class
mqtt = MqttPublish()

# instantiate new controller class
HeatCtl = HeatController()

# read yaml config file
config = HeatCtl.redis_config_values()

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

if not spot_kwh_price:
    raise AttributeError('spot_kwh_price not valid!')

if config["debug"]:
    print("electric kwh price is {} ( Øre )".format(spot_kwh_price))


forcast = HeatCtl.forcast()

# time now in utc 
timenow = datetime.utcnow().replace(tzinfo=pytz.utc)

# if now-timedelta(hours=24) <= forcast["electric_time_to_start"] <= now:
#     print("within this hour")
def date_formatter(date):
    timenow = datetime.utcnow().replace(tzinfo=pytz.utc)
    if not date:
        return "not today"

    if timenow-timedelta(hours=24) <= date <= timenow:
        return "Now"

    return str(date - timenow).split(".")[0]

# publish mqtt message to controller 
def publish_message(msg):
    if config["debug"]:
        print(json.dumps(msg, indent=4, sort_keys=True, default=str))

    mqtt.publish_status(json.dumps(msg, indent=4, sort_keys=True, default=str))
    sys.exit(0)

# def redis_config():
#     if redis_db and "operational_mode" in json.loads(redis_db.decode("utf-8")):
#         return json.loads(redis_db.decode("utf-8"))
#     else:
#         return {}
        

# sys.exit()
# create dict
pub_message = dict({
    "electric_time_to_start": date_formatter(forcast["electric_time_to_start"]),
    "fuel_time_to_start": date_formatter(forcast["fuel_time_to_start"]),
    "electric_price": spot_kwh_price,
    "uptime": str(timedelta(seconds=time.time() - psutil.boot_time())).split(".")[0],
    "datetime": timenow
})

# update config with what stored in redis
config.update(pub_message)

# sys.exit()
if config["operational_mode"] == "stopp":
    config["heater"] = "stopped"
    config["electric_time_to_start"] = "stopped"
    config["fuel_time_to_start"] = "stopped"

    GPIO.output(config["fuel_gpio_output_pin"], GPIO.LOW)
    GPIO.output(config["electric_gpio_output_pin"], GPIO.LOW)
    GPIO.cleanup()
    publish_message(config)

if (spot_kwh_price < config["fuel_kwh_price"] and config["operational_mode"] == "auto") or config["operational_mode"] == "electric":
    if config["debug"]:
        print("Prioritizes electric heating")
    # trigger rpi pin
    GPIO.output(config["electric_gpio_output_pin"], GPIO.HIGH)
    GPIO.output(config["fuel_gpio_output_pin"], GPIO.LOW)
    # get status
    #print(GPIO.input(config["electric_gpio_output_pin"]))
    
    config["heater"] = "electric"
    publish_message(config)

if (spot_kwh_price >= config["fuel_kwh_price"] and config["operational_mode"] == "auto") or config["operational_mode"] == "fuel":
    if config["debug"]:
        print("Prioritizes fuel heating")
    # trigger rpi pin
    GPIO.output(config["electric_gpio_output_pin"], GPIO.LOW)
    GPIO.output(config["fuel_gpio_output_pin"], GPIO.HIGH)

    config["heater"] = "fuel"
    publish_message(config)



