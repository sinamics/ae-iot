import { MqttConnect } from '@/lib/mqtt';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import RedisConnect from '@/lib/redis';
import { NextApiRequest, NextApiResponse } from 'next';

let redis = RedisConnect();

const mqtt = MqttConnect();
const clients = ['iot-rpios-100', 'iot-rpios-101'];

const topic = '/nodejs/mqtt';
mqtt.on('connect', () => {
  console.log('Connected');
  clients.forEach((client) => {
    mqtt.subscribe(`iot/device/${client}`, (err, granted) => {
      if (err) {
        console.log(err, 'err');
      }
      console.log(granted, 'granted');
      console.log(`Subscribe to topic '${client}'`);
    });
  });
});
mqtt.on('connect', () => {
  console.log('Connected again');
});
mqtt.on('message', function (topic, message) {
  console.log(
    'Received message ' + message.toString() + ' on topic: ' + topic.toString()
  );
});

mqtt.on('close', function () {
  console.log('Connection closed by client');
  mqtt.unsubscribe([topic]);
  mqtt.end();
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.send({
      error:
        'You must be signed in to view the protected content on this page.',
    });
  }

  switch (req.method) {
    case 'GET':
      const value = await redis.get('iot-rpios-100');
      res.status(200).json({ value });

      break;

    default:
      res.status(400).json({ status: 'not ok' });
      break;
  }
}
