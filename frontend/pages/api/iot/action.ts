import { authOptions } from '@/lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { Mqtt } from '@/lib/mqtt';

const mqtt = new Mqtt();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // send mqtt message with action to devices
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.send({
      error:
        'You must be signed in to view the protected content on this page.',
    });
  }

  const query = req.body;
  if (!query.hasOwnProperty('client_id'))
    return res.status(400).json({ status: 'client id not provided' });

  const { action, client_id } = query;

  try {
    const response = mqtt.publish(
      `iot/subscribe/${client_id}`,
      JSON.stringify({ ...action })
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
}
