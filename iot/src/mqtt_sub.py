# This example shows how you can use the MQTT client in a class.

# import context  # Ensures paho is in PYTHONPATH

from paho.mqtt import client as mqtt # type: ignore
from main import HeatController
from mqtt_pub import MqttPublish
from redis_db import r
import os.path
import os
import redis
import json
import sh

dirname = os.path.dirname(__file__)

cafile=os.path.join(dirname, 'certs/ca.crt')
keyfile=os.path.join(dirname, 'certs/client.key')
certfile=os.path.join(dirname, 'certs/client.crt')

HeatCtl = HeatController()
# instantiate new mqtt class


class MqttSubscribe(mqtt.Client):

    def on_connect(self, mqttc, obj, flags, rc):
        print("rc: "+str(rc))

    def on_message(self, mqttc, obj, msg):
        try:
            json.loads(msg.payload.decode("utf-8"))
        except:
            print("invalid json data received from mqtt broker!")
            return

        recevied_message = json.loads(msg.payload.decode("utf-8"))

        if "type" not in recevied_message:
            return print("invalid message received from broker!")

        
        if recevied_message["type"] == "update":
            print("got update request from broker")
  
            # update values in main class   
            HeatCtl.update_redis_config_values(msg.payload.decode("utf-8"))
            
            # send updated values back to broker 
            # os.system('python3 /ae-iot/iot/src/cron.py')
            os.system('python3 ./cron.py')
            return 

        elif recevied_message["type"] == "logs":
                print("broker requests log files")
                mqtt_publish = MqttPublish()
                mqtt_publish.publish_logs()
                return

        else:
            print("no valid action type received")

        
        

    def on_publish(self, mqttc, obj, mid):
        print("mid: "+str(mid))

    def on_subscribe(self, mqttc, obj, mid, granted_qos):
        print("Subscribed: "+str(mid)+" "+str(granted_qos))

    def on_log(self, mqttc, obj, level, string):
        print(string)

    def run(self):
        # self.reconnect_delay_set(min_delay=1, max_delay=120)
        self.tls_set(ca_certs=cafile, certfile=certfile, keyfile=keyfile, cert_reqs=True)
        self.connect("mqtt.kodea.no", 8884, 60)
        self.subscribe("iot/subscribe/{}".format(HeatCtl.redis_config_values()["client_id"]), 0)
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
mqttc = MqttSubscribe("{}-subscribe".format(HeatCtl.redis_config_values()["client_id"]))
rc = mqttc.run()

print("rc: "+str(rc))
