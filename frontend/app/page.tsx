'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import TimeAgo from 'react-timeago';
import { Dropdown } from '../components/dropdown';

// const SERVER_URL = 'http://10.0.0.150:5000';
const SERVER_URL = 'https://iotsrv1.egeland.io';

const socket = io(SERVER_URL, { transports: ['websocket'] });

interface IDevice {
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

const fetchData = async () => {
  const response = await fetch(`${SERVER_URL}/devices`, { cache: 'no-cache' });
  return response.json();
};

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
const App = () => {
  // const [isConnected, setIsConnected] = useState(socket.connected);
  const [iotDevices, setIotDevices] = useState<any>([]);

  const { isLoading, data } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchData,
  });
  const { mutate, isLoading: postLoading } = useMutation(postData, {
    networkMode: 'online',
  });

  useEffect(() => {
    // socket.on('connect', () => {
    //   console.log('websocket connected');
    //   setIsConnected(true);
    // });

    // socket.on('disconnect', () => {
    //   setIsConnected(false);
    // });

    socket.on('iotping', (devices) => {
      // console.log('new message', devices);

      const msg: IDevice = JSON.parse(devices);
      const dev = [...iotDevices];

      // check if device exsist in list
      const index = iotDevices.findIndex(
        (f: any) => f['client_id'] === msg['client_id']
      );
      // update or add
      if (index !== -1) {
        dev[index] = msg;
        return setIotDevices(dev);
      }

      setIotDevices((prev: any) => {
        // console.log(prev);
        return [...prev, { ...msg }];
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('iotping');
    };
  }, [iotDevices]);

  const actionHandler: any = (props: any) => {
    mutate({ ...props });
  };

  useEffect(() => {
    if (!data?.length) return;
    setIotDevices(data);
  }, [data]);

  if (isLoading)
    return (
      <div className='flex justify-center text-2xl '>
        Loading IoT devices, please wait!
      </div>
    );

  return (
    <main>
      <div className='flex justify-center'>
        {iotDevices.map((d: any, idx: any) => {
          return (
            <div className='mt-5 ' key={d['client_id']}>
              {/* {isSuccess && !isIdle ? 'action sent!' : null} */}
              <div
                className={`flex flex-col justify-between border rounded-lg m-4 p-4 w-80 relative shadow-2xl bg-slate-900 select-none
                ${postLoading ? 'border-orange-500' : ''}`}
              >
                <span className='absolute right-2 top-2'>
                  <Dropdown
                    onSelect={actionHandler}
                    client_id={d['client_id']}
                  />
                </span>
                <div className='flex justify-center mb-2'>
                  {d.friendly_name}
                </div>
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
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default App;
