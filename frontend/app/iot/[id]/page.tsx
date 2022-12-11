'use client';

import { SERVER_URL } from '@/lib/config';
import { IDevice } from '@/lib/types';
import TimeAgo from 'react-timeago';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import DeviceAction from './dispatch';
import { useSocket } from '@/hooks/useSocket';
import Log from './(components)/log';
import { Divider } from '@mantine/core';

const postData: any = async (client_id: string) => {
  const response = await fetch(`${SERVER_URL}/api/iot/devices`, {
    method: 'POST',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({ client_id: client_id }),
  });
  return response.json();
};

export default function DeviceById({ params }: any) {
  const [iotData, setIotData] = useState<any>();
  const { status: userLoading } = useSession({ required: true });

  const socket = useSocket('/api/socketio');

  const {
    isLoading: loadingDevices,
    error,
    data,
  } = useQuery(['device', params.id], () => postData(params.id));

  useEffect(() => {
    setIotData(data);
  }, [data]);

  useEffect(() => {
    socket?.on(`${params.id}/status`, (devices: any) => {
      const msg: IDevice = JSON.parse(devices);
      if (!msg || !msg.hasOwnProperty('client_id')) {
        console.log('not valid data');
        return;
      }

      setIotData((prev: any) => ({ ...prev, ...msg }));
    });

    return () => {
      // console.log('disconnected');
      socket?.off(`${params.id}/status`);
    };
  }, [socket, params.id]);

  if (userLoading === 'loading' || loadingDevices || !iotData) {
    return (
      <div className='flex justify-center text-2xl text-gray-400 pt-20'>
        Loading IoT data...
      </div>
    );
  }
  if (error instanceof Error) {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 md:grid-rows-6 grid-rows-3 overflow-auto h-screen'>
      <div className='col-start-2 row-span-full pb-48'>
        <div className='text-center text-4xl pt-12 grid-flow-col pb-20'>
          {iotData?.friendly_name}
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Name
          </label>
          <label>{iotData?.friendly_name}</label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Client ID
          </label>
          <label>{iotData?.client_id}</label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Lastseen
          </label>
          <label>
            <TimeAgo date={new Date(iotData?.datetime || 0)} />
          </label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Uptime
          </label>
          <label>{iotData?.uptime}</label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Heater
          </label>
          <label>{iotData?.heater}</label>
        </div>
        <div className='flex items-center justify-between '>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Operational Mode
          </label>
          <label>{iotData?.operational_mode}</label>
        </div>
        <div className='flex items-center justify-between '>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Electric Price
          </label>
          <label>{iotData?.electric_price}</label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Electric Scheduled
          </label>
          <label>{iotData?.electric_time_to_start}</label>
        </div>
        <div className='flex items-center justify-between '>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Fuel Price
          </label>
          <label>{iotData?.fuel_price}</label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Fuel Scheduled
          </label>
          <label>{iotData?.fuel_time_to_start}</label>
        </div>
        <div className='flex items-center justify-between mb-6'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            System
          </label>
          <label>{iotData?.system}</label>
        </div>
        <DeviceAction iotDataProps={iotData} />
        <Divider
          my='md'
          label='Logg'
          labelPosition='center'
          className='pt-20'
        />
        <div className='pt-14 pb-44'>
          <Log params={params} />
        </div>
      </div>
    </div>
  );
}
