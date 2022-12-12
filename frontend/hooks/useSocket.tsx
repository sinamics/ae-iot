import { SERVER_URL } from '@/lib/config';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect((): any => {
    // fetch api endpoint to start socket io server
    fetch(url).finally(() => {
      // server_url is defined in the config
      const socketio = io(`${SERVER_URL}`, {
        path: url,
        transports: ['websocket'],
      });
      socketio.on('connect', () => {
        console.log('websocket connected');
      });
      socketio.on('disconnect', () => {
        console.log('disconnect');
      });
      setSocket(socketio);
    });
    return () => socket?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return socket;
};
