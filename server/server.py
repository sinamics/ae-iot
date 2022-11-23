# Import flask and datetime module for showing date and time
from __future__ import print_function # In python 2.7
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, send
from flask_cors import CORS
import datetime
import eventlet
import eventlet.wsgi
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from werkzeug.debug import DebuggedApplication
from dotenv import load_dotenv
from paho.mqtt import client as mqtt_client # type: ignore
import json
import redis
import os.path

load_dotenv()

r = redis.Redis(host='redis', port=6379, db=0)
x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SERVER_SECRET')


socketio = SocketIO(app, cors_allowed_origins='*')

broker = 'mqtt.kodea.no'
port = 8884

# generate client ID with pub prefix randomly
client_id = f'mqtt-controller'
clients = ["iot/device/iot-device-100"]

cafile="certs/ca.crt"
keyfile="certs/client.key"
certfile="certs/client.crt"

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
        client.tls_set(ca_certs=cafile, certfile=certfile, keyfile=keyfile, cert_reqs=True)
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

        r.set(msg["iot-device"], message.payload.decode("utf-8"))
        socketio.emit('iot-ping', message.payload.decode("utf-8"))
        # get_iot_devices(message.payload.decode("utf-8"))
        print(str(message.payload.decode("utf-8")))

    def run(self):
        self.client = self.connect_mqtt()

        for client in clients:
            self.client.subscribe(client)

        self.client.on_message = self.on_message
        self.client.loop_start()

mq = Mqtt()


# Route for seeing a data
@app.route('/action', methods=["POST"])
def action():
    data = request.get_json()
    # Returning an api for showing in  reactjs
    # redis_devices = r.keys("iot-device*")
    mq.publish("iot/subscribe/iot-device-100", json.dumps({"operational_mode": data}))
    print(data)
    return jsonify('OK'),200
    
# Route for seeing a data
@app.route('/devices')
def devices():
    # Returning an api for showing in  reactjs
    # redis_devices = r.keys("iot-device*")

    devices_arr = []
    for device in r.scan_iter(match='iot-device*'):
        node = r.get(device)
        # print(node)
        devices_arr.append(json.loads(node))

    print(devices_arr)
    return json.dumps(devices_arr)

# Handle the webapp connecting to the websocket
@socketio.on('connect')
def test_connect():
    print('someone connected to websocket')
    # emit('responseMessage', {'data': 'Connected! ayy'})
    # need visibility of the global thread object

@socketio.on('devices')
def handle_message(message):
    send(message)

# Running app
# @run_with_reloader
def run_server():
    mq.run()

    app.debug = True
    if app.debug:
        application = DebuggedApplication(app)
    else:
        application = app
    CORS(app)
    # http_server = WSGIServer(('',5000), application, handler_class=WebSocketHandler)
    # http_server.serve_forever()
    eventlet.wsgi.server(eventlet.listen(('0.0.0.0', 5000)), application)
    #host="10.0.0.150", debug=True

if __name__ == '__main__':
    run_server()