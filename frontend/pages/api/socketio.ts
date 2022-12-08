import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import Mqtt from '@/lib/mqtt';

async function socketio(req: NextApiRequest, res: any) {
  if (res.socket.server.io) {
    console.log('Socket server exist!...');
    return res.end();
  }

  console.log('New Socket.io server...');
  // adapt Next's net Server to http Server
  const httpServer: NetServer = res.socket.server as any;
  const io = new ServerIO(httpServer, {
    path: '/api/socketio',
  });

  // append SocketIO server to Next.js socket server response
  res.socket.server.io = io;

  // mqListner(res.socket.server.io);
  const mqtt = new Mqtt(res.socket.server.io);
  mqtt.connect();
  mqtt.subscribe();

  // append mqtt server to Next.js socket server response
  res.socket.server.mqtt = mqtt;
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default socketio;
