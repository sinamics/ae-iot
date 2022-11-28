# Import flask and datetime module for showing date and time
from __future__ import print_function # In python 2.7
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS
from pprint import pprint
import datetime
import eventlet
eventlet.monkey_patch()
from mqtt import Mqtt
import eventlet.wsgi
from dotenv import load_dotenv
import json
import redis
import os.path

load_dotenv()


x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SERVER_SECRET')

socketio = SocketIO(app, cors_allowed_origins='*')

class Server():
    def __init__(self, mqtt, **args) -> None:
        app.debug = args["debug"]
        self.mqtt = mqtt

        redis_host = "redis"
        if app.debug:
            redis_host = "localhost"

        self.r = redis.Redis(host=redis_host, port=6379, db=0)

    def run(self):
        # Route for seeing a data
        @app.route('/action', methods=["POST"])
        def action():
            data = request.get_json()

            if not data["client_id"]:
                return jsonify('No clientId'),500
         
            # Returning an api for showing in  reactjs
            self.mq.publish("iot/subscribe/{}".format(data["client_id"]), json.dumps(data))
            return jsonify('OK'),200
            
        # Route for seeing a data
        @app.route('/devices')
        def devices():
            # Returning an api for showing in  reactjs
            # redis_devices = r.keys("iot-device*")
            # self.r.delete("iot-device-100")

            devices_arr = []
            for device in self.r.scan_iter(match='iot*'):
                node = self.r.get(device)          
                try:
                    json.loads(node)
                except:
                    break
                pass
    
                devices_arr.append(json.loads(node))

            if app.debug:
                pprint(devices_arr)

            return json.dumps(devices_arr)

        # Handle the webapp connecting to the websocket
        @socketio.on('connect')
        def test_connect(self):
            print('someone connected to websockets')
            # emit('responseMessage', {'data': 'Connected! ayy'})
            # need visibility of the global thread object

        # Running app
        # @run_with_reloader
        # def run_server(self):

        # if app.debug:
        CORS(app)

        self.mq = self.mqtt(socketio, app.debug, self.r)
        self.mq.run()
        # http_server = WSGIServer(('',5000), application, handler_class=WebSocketHandler)
        # http_server.serve_forever()
        eventlet.wsgi.server(eventlet.listen(('0.0.0.0', 5000)), app)
        # socketio.run(app, host="0.0.0.0", port="5000" )

if __name__ == '__main__':
    s = Server(Mqtt, debug=False)
    s.run()