import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import mqtt from '@/lib/mqtt';
import RedisConnect from '@/lib/redis';

const redis = RedisConnect();
// const mqtt = new Mqtt();

const mqListner = (io: any) => {
  mqtt.message((msg: any) => {
    redis.set(msg['client_id'], JSON.stringify(msg));
    io.emit('iotping', JSON.stringify(msg));
  });
};

async function socketio(req: NextApiRequest, res: any) {
  if (!res.socket.server.io) {
    console.log('New Socket.io server...');
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socketio',
    });

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  mqListner(res.socket.server.io);
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default socketio;
