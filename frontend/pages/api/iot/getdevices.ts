import mqtt from 'mqtt';
import fs from 'fs';
import path from 'path';

const host = 'mqtt.kodea.no';
const port = '8884';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;

console.log(process.cwd());

var caFile = fs.readFileSync(path.join(process.cwd(), 'certs/ca.crt'));
var certFile = fs.readFileSync(path.join(process.cwd(), 'certs/client.crt'));
var keyFile = fs.readFileSync(path.join(process.cwd(), 'certs/client.key'));

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
  ca: [caFile],
  cert: certFile,
  key: keyFile,
});

const topic = '/nodejs/mqtt';
client.on('connect', () => {
  console.log('Connected');
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
});

export default async function handler(req: any, res: any) {
  console.log(req.method);
  res.status(200).json({ status: 'ok' });
}
