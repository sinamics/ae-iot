# Import flask and datetime module for showing date and time
from __future__ import print_function # In python 2.7
from paho.mqtt import client as mqtt_client # type: ignore
from datetime import datetime, date, timedelta
from pprint import pprint
import pytz
import json



broker = 'mqtt.kodea.no'
port = 8884

# generate client ID with pub prefix randomly
client_id = f'mqtt-controller'
clients = ["iot-rpios-100", "iot-rpios-101"]

cafile="certs/ca.crt"
keyfile="certs/client.key"
certfile="certs/client.crt"

class Mqtt():
    def __init__(self, socket, debug, redis) -> None:
        self.socket = socket
        self.r = redis
        self.debug = debug

    def connect_mqtt(self):
        # def on_connect(client, userdata, flags, rc):
        #     if rc == 0:
        #         print("Connected to MQTT Broker!")

        #     else:
        #         print("Failed to connect, return code %d\n", rc)
        if self.debug:
            client = mqtt_client.Client()
        else:
            client = mqtt_client.Client(client_id)

        client.on_message = self.on_message
        client.on_connect_fail = self.connect_fail
        client.on_log = self.on_log
        client.on_subscribe = self.on_subscribe
        client.reconnect_delay_set(min_delay=1, max_delay=120)
        client.tls_set(ca_certs=cafile, certfile=certfile, keyfile=keyfile, cert_reqs=True)
        # client.on_connect = on_connect
        client.connect(broker, port, keepalive=60)
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

    def connect_fail(self, mqttc, obj, flags, rc):
        print("connect failed with code: "+str(rc))

    def on_log(self, mqttc, obj, level, string):
        print(string)

    def on_subscribe(self, mqttc, obj, mid, granted_qos):
        print("Subscribed: "+str(mid)+" "+str(granted_qos))

    def on_message(self, client, userdata, message):
        # print(message.payload.decode("utf-8"))
        # The callback for when a PUBLISH message is received from the server. print("Message received-> " 
        msg = json.loads(message.payload.decode("utf-8"))
        # print(str(message.payload.decode("utf-8")))
        if not "client_id" in msg:
            return

        self.socket.emit('iotping', json.dumps(msg))
        # print("messages will be sent by socketio")
        self.r.set(msg["client_id"], json.dumps(msg))
        # get_iot_devices(message.payload.decode("utf-8"))
        

    def run(self):
        self.client = self.connect_mqtt()

        for client in clients:
            self.client.subscribe("iot/device/{}".format(client))

        self.client.loop_start()