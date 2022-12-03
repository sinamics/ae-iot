import mqtt, { MqttClient } from 'mqtt';
import fs from 'fs';
import path from 'path';
import RedisConnect from '@/lib/redis';
const redis = RedisConnect();
let client: MqttClient;

const host = 'mqtt.kodea.no';
const port = '8884';
const clientId = `mqtt_nextjs`;

const connectUrl = `mqtt://${host}:${port}`;

var caFile = fs.readFileSync(path.join(process.cwd(), 'certs/ca.crt'));
var certFile = fs.readFileSync(path.join(process.cwd(), 'certs/client.crt'));
var keyFile = fs.readFileSync(path.join(process.cwd(), 'certs/client.key'));

const topics = ['iot-rpios-100', 'iot-rpios-101'];

export const MqttConnect = () => {
  if (client) {
    console.log('reusing previous mqtt client object');
    return client;
  }

  client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
    ca: [caFile],
    cert: certFile,
    key: keyFile,
  });

  client.on('connect', () => {
    console.log('Connected');

    topics.forEach((topic) => {
      client.subscribe(`iot/device/${topic}`, (err, granted) => {
        if (err) {
          console.log(err, 'err');
        }
        console.log(granted, 'granted');
        console.log(`Subscribe to topic '${topic}'`);
      });
    });
  });

  client.on('connect', () => {
    console.log('Connected again');
  });

  client.on('message', function (topic, message: any) {
    const msg = JSON.parse(message);
    if ('client_id'! in msg) return;

    redis.set(message['client_id'], JSON.stringify(msg));
    console.log(
      'Received message ' + msg.toString() + ' on topic: ' + topic.toString()
    );
  });

  client.on('close', function () {
    console.log('Connection closed by client');
    topics.forEach((topic) => {
      client.unsubscribe(`iot/device/${topic}`, (err: any, granted: any) => {
        if (err) {
          console.log(err, 'err');
        }
        console.log(granted, 'granted');
        console.log(`Subscribe to topic '${topic}'`);
      });
    });
    client.end();
  });

  return client;
};
