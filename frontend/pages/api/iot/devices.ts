import { MqttConnect } from '@/lib/mqtt';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import RedisConnect from '@/lib/redis';
import { NextApiRequest, NextApiResponse } from 'next';

const redis = RedisConnect();
MqttConnect();

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
      const redisResult = new Set();
      const all = await redis.scan('0', 'MATCH', 'iot*');
      for (let x = 0; x < all[1].length; x++) {
        redisResult.add(await redis.get(all[1][x]));
      }

      res.status(200).json(Array.from(redisResult));
      break;

    case 'POST':
      const query = req.body;

      if (!query.hasOwnProperty('client_id'))
        return res.status(400).json({ status: 'client id not provided' });

      res.status(200).json(JSON.parse(await redis.get(query.client_id)));

      break;

    case 'PUT':
      const value = req.body;
      if ('client_id'! in value || 'value'! in value)
        return res.status(400).json({ status: 'client id not provided' });

      await redis.put(query.client_id, query.value);

      break;
    default:
      res.status(400).json({ status: 'not ok' });
      break;
  }
}
