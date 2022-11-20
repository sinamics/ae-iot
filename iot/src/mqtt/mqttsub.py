# python 3.6

from __future__ import print_function # In python 2.7
from paho.mqtt import client as mqtt_client # type: ignore
# from main import HeatController
from .mqtt import Mqtt
broker = 'mqtt.kodea.no'
port = 1883

# QOS 0 – Once (not guaranteed)
# QOS 1 – At Least Once (guaranteed)
# QOS 2 – Only Once (guaranteed)

class MqttSub(Mqtt):
    def __init__(self) -> None:
        self.client = self.connect_mqtt()
        self.client.on_message = self.on_message
        self.client.subscribe([("iot/{0}/action".format("iot-device-100"), 0), ("iot/ping", 0)])

    def on_message(self, client, userdata, message):  
        # The callback for when a PUBLISH message is received from the server. print("Message received-> " 
        # + msg.topic + " " + str(msg.payload))  # Print a received msg
        print(str(message.payload.decode("utf-8")))

    def mqtt_stop(self):
        self.client.loop_stop()

    def mqtt_once(self):
        self.client.loop_start()

    def run_forever(self):
        self.client.loop_forever()

if __name__ == '__main__':
    mqtt = MqttSub()
    mqtt.run_forever()