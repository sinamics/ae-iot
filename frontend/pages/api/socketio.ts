import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import Mqtt from '@/lib/mqtt';

async function socketio(req: NextApiRequest, res: NextApiResponse | any) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.send({
      error:
        'You must be signed in to view the protected content on this page.',
    });
  }

  // console.log(res.socket.server.io);
  if (!res.socket.server.io) {
    console.log('Creating New Socket.io server...');
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socketio',
    });
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }

  if (!res.socket.server.mqtt || !res.socket.server.mqtt.connected) {
    console.log('Creating New Mqtt server...');

    // mqListner(res.socket.server.io);
    const mqtt = new Mqtt(res.socket.server.io);
    mqtt.connect();
    mqtt.subscribe();

    // append mqtt server to Next.js socket server response
    res.socket.server.mqtt = mqtt;
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default socketio;
