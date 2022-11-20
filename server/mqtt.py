# python 3.6
from __future__ import print_function # In python 2.7
from paho.mqtt import client as mqtt_client # type: ignore
from server import get_iot_devices
import json

broker = '10.0.0.150'
port = 1883

# generate client ID with pub prefix randomly
client_id = f'mqtt-controller'
username = 'mqtt'
password = 'mqtt'

# QOS 0 – Once (not guaranteed)
# QOS 1 – At Least Once (guaranteed)
# QOS 2 – Only Once (guaranteed)
clients = ["iot/device/iot-device-100"]

class Mqtt:
    def __init__(self) -> None:
        pass

    def connect_mqtt(self):
        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                print("Connected to MQTT Broker!")
                # client.subscribe([("iot/device/iot-device-100", 0), ("iot/ping", 0)])
            else:
                print("Failed to connect, return code %d\n", rc)

        client = mqtt_client.Client(client_id)
        
        # client.username_pw_set(username, password)
        client.on_connect = on_connect
        client.connect(broker, port)
        return client

    def publish(self, topic, msg):
        result = self.client.publish(topic, msg)
        # result: [0, 1]
        status = result[0]
        if status == 0:
            print(f"Send `{msg}` to topic `{topic}`")
        else:
            print(f"Failed to send message to topic {topic}")

    def service_sub(self):
        result = self.client.subscribe_callback()

    def on_message(self, client, userdata, message): 
        # The callback for when a PUBLISH message is received from the server. print("Message received-> " 
        msg = json.loads(message.payload.decode("utf-8"))

        if not "iot-device" in msg:
            return
        # get_iot_devices(message.payload.decode("utf-8"))
        print(str(message.payload.decode("utf-8")))

    def run(self):
        self.client = self.connect_mqtt()

        for client in clients:
            self.client.subscribe(client)

        self.client.on_message = self.on_message
        self.client.loop_start()

if __name__ == '__main__':
    mq = Mqtt()
    mq.run()
    while True:
        pass