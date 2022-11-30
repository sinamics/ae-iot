import io, { Socket } from 'socket.io-client';

let socket: Socket;

interface IDevice {
  available: boolean;
  datetime: string;
  electric_price: number;
  electric_time_to_start: string;
  friendly_name: string;
  fuel_price: number;
  fuel_time_to_start: string;
  heater: string;
  client_id: string;
  operational_mode: string;
  system: string;
  uptime: string;
}

export const initiateSocketConnection = () => {
  if (!socket) return false;

  //   socket = io('https://iotsrv1.egeland.io', {
  //     transports: ['websocket'],
  //   });

  socket = io('http://10.0.0.150:5000', {
    transports: ['websocket'],
  });
};

export const subscribeToPing = (clb: ([]) => any) => {
  if (!socket) return true;
  socket.on('connect', () => {
    console.log('connected');
  });
  socket.on('disconnect', (reason) => {
    console.log('Disconnected...');
  });
  socket.on('iotping', (devices: IDevice[]) => {
    // console.log('new message', devices);
    clb(devices);
  });
};

export const disconnectSocket = () => {
  console.log('Disconnecting socket...');

  if (socket) {
    socket.off('connect');
    socket.off('disconnect');
    socket.off('iotping');
    socket.disconnect();
  }
};
