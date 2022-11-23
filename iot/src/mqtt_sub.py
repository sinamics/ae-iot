# This example shows how you can use the MQTT client in a class.

# import context  # Ensures paho is in PYTHONPATH

from paho.mqtt import client as mqtt # type: ignore
from main import HeatController
import os.path
import os
import redis

dirname = os.path.dirname(__file__)

cafile=os.path.join(dirname, 'certs/ca.crt')
keyfile=os.path.join(dirname, 'certs/client.key')
certfile=os.path.join(dirname, 'certs/client.crt')

HeatCtl = HeatController()

r = redis.Redis(host='redis', port=6379, db=0)

class MqttSubscribe(mqtt.Client):

    def on_connect(self, mqttc, obj, flags, rc):
        print("rc: "+str(rc))

    def on_message(self, mqttc, obj, msg):
        print(msg.topic+" "+str(msg.qos)+" "+str(msg.payload))
        print(msg.payload.decode("utf-8"))
        r.set("{}/config".format(HeatCtl.read_config()["client_id"]), msg.payload.decode("utf-8"))
        os.system('python3 cron.py')


    def on_publish(self, mqttc, obj, mid):
        print("mid: "+str(mid))

    def on_subscribe(self, mqttc, obj, mid, granted_qos):
        print("Subscribed: "+str(mid)+" "+str(granted_qos))

    def on_log(self, mqttc, obj, level, string):
        print(string)

    def run(self):
        self.tls_set(ca_certs=cafile, certfile=certfile, keyfile=keyfile, cert_reqs=True)
        self.connect("mqtt.kodea.no", 8884, 60)
        self.subscribe("iot/subscribe/{}".format(HeatCtl.read_config()["client_id"]), 0)
        self.on_message = self.on_message
        self.on_subscribe = self.on_subscribe

        rc = 0
        while rc == 0:
            rc = self.loop()
        return rc


# If you want to use a specific client id, use
# mqttc = MyMQTTClass("client-id")
# but note that the client id must be unique on the broker. Leaving the client
# id parameter empty will generate a random id for you.
mqttc = MqttSubscribe("iot-device-100-subscribe")
rc = mqttc.run()

print("rc: "+str(rc))
