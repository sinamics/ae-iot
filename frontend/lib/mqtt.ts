import mqtt, { MqttClient } from 'mqtt';
import fs from 'fs';
import path from 'path';
import RedisConnect from '@/lib/redis';

const redis = RedisConnect();

const host = 'mqtt.kodea.no';
const port = '8884';
const clientId = `mqtt_nextjs`;

const connectUrl = `mqtt://${host}:${port}`;

var caFile = fs.readFileSync(path.join(process.cwd(), 'certs/ca.crt'));
var certFile = fs.readFileSync(path.join(process.cwd(), 'certs/client.crt'));
var keyFile = fs.readFileSync(path.join(process.cwd(), 'certs/client.key'));

const topics = ['iot-rpios-100', 'iot-rpios-101'];

class Mqtt {
  mqtt: any;
  mqtt_client: any;
  connected: boolean;
  constructor() {
    this.mqtt = mqtt;
    this.mqtt_client = null;
    this.connected = false;
    this.connect();
  }

  connect() {
    if (this.connected) return;

    this.mqtt_client = this.mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
      ca: [caFile],
      cert: certFile,
      key: keyFile,
    }) as MqttClient;

    this.connected = true;
    console.log('MQTT Connected');

    this.subscribe();
    this.un_subscribe();
    this.store_messages();
  }
  store_messages() {
    this.mqtt_client.on('message', function (topic: any, message: any) {
      const msg = JSON.parse(message.toString('utf8'));
      if (!('client_id' in msg)) return console.log('invalid mqtt message!');

      console.log('Storing data in DB');
      redis.set(msg['client_id'], JSON.stringify(msg));
    });
  }
  message(callback: (msg: any) => any) {
    this.mqtt_client.on('message', function (topic: any, message: any) {
      const msg = JSON.parse(message.toString('utf8'));
      if (!('client_id' in msg)) return console.log('invalid mqtt message!');
      console.log('Received message on topic: ' + topic);
      callback(msg);
    });
  }
  subscribe() {
    this.connect();
    topics.forEach((topic) => {
      this.mqtt_client.subscribe(
        `iot/device/${topic}`,
        (err: any, granted: any) => {
          if (err) {
            console.log('mqtt subscribe error::: ', err);
          }
          console.log(granted, 'granted');
          console.log(`Subscribe to topic '${topic}'`);
        }
      );
    });
  }
  publish(topic: string, message: string) {
    if (!this.connected) {
      this.connect();
    }
    try {
      this.mqtt_client.publish(topic, message);
      return { status: 'mqtt message published' };
    } catch (error) {
      return error;
    }
  }
  un_subscribe() {
    this.mqtt_client.on('close', () => {
      this.connected = false;
      console.log('MQTT Connection closed by client');
      // topics.forEach((topic) => {
      //   this.mqtt_client.unsubscribe(
      //     `iot/device/${topic}`,
      //     (err: any, granted: any) => {
      //       if (err) {
      //         console.log(err, 'err');
      //       }
      //       console.log(granted, 'granted');
      //       console.log(`unsubscribed to topic '${topic}'`);
      //     }
      //   );
      // });
      this.mqtt_client.end();
    });
  }
}

const newMqtt = new Mqtt();
export default newMqtt;
