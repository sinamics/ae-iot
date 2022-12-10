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
  const [tableData, setTableData] = useState<any>();
  const { status: userLoading } = useSession({ required: true });

  const socket = useSocket('/api/socketio');

  const { isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const data = await postData(params.id);
      setTableData(data);
      return data;
    },
    networkMode: 'offlineFirst',
  });

  useEffect(() => {
    socket?.on(`${params.id}/status`, (devices: any) => {
      const msg: IDevice = JSON.parse(devices);
      if (!msg || !msg.hasOwnProperty('client_id')) {
        console.log('not valid data');
        return;
      }

      setTableData((prev: any) => ({ ...prev, ...msg }));
    });

    return () => {
      console.log('disconnected');
      socket?.off(`${params.id}/status`);
    };
  }, [socket, params.id]);

  if (userLoading === 'loading' || isLoading) {
    return (
      <div className='flex justify-center text-2xl text-gray-400'>
        Loading...
      </div>
    );
  }
  if (error instanceof Error) {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 md:grid-rows-6 grid-rows-3 overflow-auto h-screen'>
      <div className='col-start-2 grid-flow-row'>
        <div className='text-center text-4xl pt-12 grid-flow-col pb-20'>
          {tableData?.friendly_name}
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Name
          </label>
          <label>{tableData?.friendly_name}</label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Client ID
          </label>
          <label>{tableData?.client_id}</label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Lastseen
          </label>
          <label>
            <TimeAgo date={new Date(tableData?.datetime || 0)} />
          </label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Uptime
          </label>
          <label>{tableData?.uptime}</label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Heater
          </label>
          <label>{tableData?.heater}</label>
        </div>
        <div className='flex items-center justify-between '>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Operational Mode
          </label>
          <label>{tableData?.operational_mode}</label>
        </div>
        <div className='flex items-center justify-between '>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Electric Price
          </label>
          <label>{tableData?.electric_price}</label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Electric Scheduled
          </label>
          <label>{tableData?.electric_time_to_start}</label>
        </div>
        <div className='flex items-center justify-between '>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Fuel Price
          </label>
          <label>{tableData?.fuel_price}</label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Fuel Scheduled
          </label>
          <label>{tableData?.fuel_time_to_start}</label>
        </div>
        <div className='flex items-center justify-between mb-6'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            System
          </label>
          <label>{tableData?.system}</label>
        </div>
        <DeviceAction data={tableData} />
      </div>
      <div className='container col-start-3 pt-14'>
        <Log params={params} />
      </div>
    </div>
  );
}
// available: boolean;
// datetime: string;
// electric_price: number;
// electric_time_to_start: string;
// friendly_name: string;
// fuel_price: number;
// fuel_time_to_start: string;
// heater: string;
// client_id: string;
// operational_mode: string;
// system: string;
// uptime: string;
