'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import TimeAgo from 'react-timeago';
import {
  disconnectSocket,
  initiateSocketConnection,
  subscribeToPing,
} from '../../../service/socket';
import { Dropdown } from '@/components/dropdown';

// const SERVER_URL = 'http://10.0.0.150:5000';
export const SERVER_URL = 'https://iotsrv1.egeland.io';

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

const postData = async (data: any) => {
  const response = await fetch(`${SERVER_URL}/action`, {
    method: 'POST',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

const DeviceList = ({ devices }: { devices: IDevice[] }) => {
  // const [isConnected, setIsConnected] = useState(socket.connected);
  const [iotDevices, setIotDevices] = useState<any>(devices);

  const { mutate, isLoading: postLoading } = useMutation(postData, {
    networkMode: 'online',
  });

  useEffect(() => {
    initiateSocketConnection();

    subscribeToPing((devices: any) => {
      const msg: IDevice = JSON.parse(devices);

      setIotDevices((prev: any) => {
        const p = [...prev];
        // check if device exsist in list
        const index = p.findIndex(
          (f: any) => f['client_id'] === msg['client_id']
        );
        // update or add
        if (index !== -1) {
          p[index] = msg;
          return p;
        }

        return [...prev, { ...msg }];
      });
    });

    return () => disconnectSocket();
  }, []);

  const actionHandler: any = (props: any) => {
    mutate({ ...props });
  };

  return (
    <div className='flex justify-center flex-wrap w-full'>
      {iotDevices.sort().map((d: any, idx: any) => {
        const isOnline =
          (new Date().getTime() - new Date(d.datetime).getTime()) / 1000;

        return (
          <div
            key={d['client_id']}
            className={`w-[300px] flex flex-col justify-between border rounded-lg m-4 p-4 relative shadow-2xl bg-slate-900 select-none 
                ${postLoading ? 'border-orange-500' : ''} ${
              isOnline < 600 ? 'border-green-500' : 'border-red-500'
            }`}
          >
            <span className='absolute right-2 top-2'>
              <Dropdown onSelect={actionHandler} client_id={d['client_id']} />
            </span>
            <div className='flex justify-center mb-2'>{d.friendly_name}</div>
            <div className='flex justify-between'>
              <span>Client id:</span>
              <span>{d['client_id']}</span>
            </div>
            <div className='flex justify-between'>
              <span>Operational Mode:</span>
              <span>{d.operational_mode}</span>
            </div>
            <div className='flex justify-between'>
              <span>Lastseen:</span>
              <span>
                <TimeAgo date={new Date(d.datetime)} />
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Uptime:</span>
              <span>{d.uptime}</span>
            </div>
            <div className='flex justify-between'>
              <span>Heater:</span>
              <span>{d.heater}</span>
            </div>
            <div className='flex justify-between'>
              <span>Electric scheduled:</span>
              <span>{d.electric_time_to_start}</span>
            </div>
            <div className='flex justify-between'>
              <span>Fuel scheduled:</span>
              <span>{d.fuel_time_to_start}</span>
            </div>
            <div className='flex justify-between'>
              <span>Electric kWh price:</span>
              <span>{d.electric_price}</span>
            </div>
            <div className='flex justify-between'>
              <span>Fuel kWh price:</span>
              <span>{d.fuel_price}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeviceList;