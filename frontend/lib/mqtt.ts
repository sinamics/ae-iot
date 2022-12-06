import mqtt, { MqttClient } from 'mqtt';
import fs from 'fs';
import path from 'path';

let client: MqttClient;

const host = 'mqtt.kodea.no';
const port = '8884';
const clientId = `mqtt_nextjs`;

const connectUrl = `mqtt://${host}:${port}`;

var caFile = fs.readFileSync(path.join(process.cwd(), 'certs/ca.crt'));
var certFile = fs.readFileSync(path.join(process.cwd(), 'certs/client.crt'));
var keyFile = fs.readFileSync(path.join(process.cwd(), 'certs/client.key'));

const topics = ['iot-rpios-100', 'iot-rpios-101'];

export class Mqtt {
  mqtt: any;
  mqtt_client: any;
  constructor() {
    this.mqtt = mqtt;
    this.mqtt_client = null;

    this.connect();
    this.subscribe();
    this.un_subscribe();
  }

  connect() {
    if (this.mqtt_client) return;

    this.mqtt_client = this.mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
      ca: [caFile],
      cert: certFile,
      key: keyFile,
    }) as MqttClient;
  }
  message(callback: (msg: any) => any) {
    this.mqtt_client.on('message', function (topic: any, message: any) {
      const msg = JSON.parse(message.toString('utf8'));
      if (!('client_id' in msg)) return console.log('invalid mqtt message!');
      callback(msg);
      console.log('Received message on topic: ' + topic);
    });
  }
  subscribe() {
    topics.forEach((topic) => {
      this.mqtt_client.subscribe(
        `iot/device/${topic}`,
        (err: any, granted: any) => {
          if (err) {
            console.log(err, 'err');
          }
          console.log(granted, 'granted');
          console.log(`Subscribe to topic '${topic}'`);
        }
      );
    });
  }
  un_subscribe() {
    let client = this.mqtt_client;
    client.on('close', function () {
      console.log('Connection closed by client');
      topics.forEach((topic) => {
        client.unsubscribe(`iot/device/${topic}`, (err: any, granted: any) => {
          if (err) {
            console.log(err, 'err');
          }
          console.log(granted, 'granted');
          console.log(`unsubscribed to topic '${topic}'`);
        });
      });
      client.end();
    });
  }
}
