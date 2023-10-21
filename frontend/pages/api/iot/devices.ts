// import { MqttConnect } from '@/lib/mqtt';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import RedisConnect from '@/lib/redis';
import { NextApiRequest, NextApiResponse } from 'next';

const redis = RedisConnect();

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
    case 'POST':
      const query = req.body as { client_id: string };

      // Validate the query and throw an error if it is invalid
      if (!query.hasOwnProperty('client_id')) {
        throw new Error('client id not provided');
      }

      try {
        // Get the value from Redis
        const value = (await redis.get(query.client_id)) as string;

        // Parse the value from JSON
        const jsonValue = JSON.parse(value);

        res.status(200).json(jsonValue);
      } catch (error) {
        // Handle any errors that may occur while getting the value from Redis
        console.error('Redis Error:', error);
        res.status(500).json({ status: 'Internal Server Error' });
      }

      break;
    default:
      res.status(400).json({ status: 'not ok' });
      break;
  }
}
