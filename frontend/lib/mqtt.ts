import mqtt, { MqttClient } from 'mqtt';
import fs from 'fs';
import path from 'path';
import { Socket, SocketOptions } from 'socket.io-client';

let client: MqttClient;

const host = 'mqtt.kodea.no';
const port = '8884';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;

var caFile = fs.readFileSync(path.join(process.cwd(), 'certs/ca.crt'));
var certFile = fs.readFileSync(path.join(process.cwd(), 'certs/client.crt'));
var keyFile = fs.readFileSync(path.join(process.cwd(), 'certs/client.key'));

export const MqttConnect = () => {
  if (client) {
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

  return client;
};
