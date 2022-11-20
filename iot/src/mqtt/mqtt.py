# python 3.6

from __future__ import print_function # In python 2.7
from paho.mqtt import client as mqtt_client # type: ignore
import sys
# import HeatController

broker = 'mqtt.kodea.no'
port = 1883

# generate client ID with pub prefix randomly
username = 'mqtt'
password = 'mqtt'

# instantiate new class
# HeatCtl = HeatController(None)

# read yaml config file
# config = HeatCtl.read_config()

# QOS 0 – Once (not guaranteed)
# QOS 1 – At Least Once (guaranteed)
# QOS 2 – Only Once (guaranteed)

class Mqtt:
    def __init__(self) -> None:
        pass

    def connect_mqtt(self):
        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                print("Connected to MQTT Broker!")
                # client.subscribe([("iot/{0}/action".format(config["client_id"]), 0), ("iot/ping", 0)])
            else:
                print("Failed to connect, return code %d\n", rc)

        client = mqtt_client.Client("iot-device-100")
        # client.username_pw_set(username, password)
        client.on_connect = on_connect
        client.connect(broker, port)
        return client

