from paho.mqtt import client as mqtt # type: ignore
from main import HeatController
import os.path
dirname = os.path.dirname(__file__)

# QOS 0 – Once (not guaranteed)
# QOS 1 – At Least Once (guaranteed)
# QOS 2 – Only Once (guaranteed)

cafile=os.path.join(dirname, 'certs/ca.crt')
keyfile=os.path.join(dirname, 'certs/client.key')
certfile=os.path.join(dirname, 'certs/client.crt')

HeatCtl = HeatController()

class MqttPublish():
    def __init__(self):
        self.client = mqtt.Client("{}-publish".format(HeatCtl.read_config()["client_id"]))
        self.client.tls_set(ca_certs=cafile, certfile=certfile, keyfile=keyfile, cert_reqs=True)
        self.client.connect("mqtt.kodea.no", 8884, 60)
        self.client.reconnect_delay_set(min_delay=1, max_delay=120)
        self.client.on_connect = self.on_connect

    def on_connect(self, mqttc, obj, flags, rc):
        print("return code: "+str(rc))

    def publish(self, msg):
        self.client.loop_start()

        infot = self.client.publish("iot/device/{}".format(HeatCtl.read_config()["client_id"]), msg, qos=2)
        infot.wait_for_publish()

        self.client.loop_stop()
        self.client.disconnect()