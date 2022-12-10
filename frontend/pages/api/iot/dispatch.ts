import { authOptions } from '@/lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';

export default async function handler(req: NextApiRequest, res: any) {
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
  const mqtt = res.socket.server.mqtt;

  try {
    const response = mqtt.publish(
      `iot/subscribe/${client_id}`,
      JSON.stringify({ ...action })
    );
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}
