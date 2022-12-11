import { SERVER_URL } from '@/lib/config';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    fetch(url).finally(() => {
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
    function cleanup() {
      socket?.disconnect();
    }
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return socket;
};
