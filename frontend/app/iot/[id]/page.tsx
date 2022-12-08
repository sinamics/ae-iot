'use client';

import { SERVER_URL } from '@/lib/config';
import { IDevice } from '@/lib/types';
import TimeAgo from 'react-timeago';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import DeviceAction from './(components)/actions';
import { useSocket } from '@/hooks/useSocket';

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
    socket?.on(params.id, (devices: any) => {
      const msg: IDevice = JSON.parse(devices);
      if (!msg || !msg.hasOwnProperty('client_id')) {
        console.log('not valid data');
        return;
      }
      console.log(msg);
      setTableData((prev: any) => ({ ...prev, ...msg }));
    });

    return () => {
      console.log('disconnected');
      socket?.off('iotping');
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
    <div className='container pt-20 grid grid-cols-3'>
      <div className='col-span-3 text-center text-4xl p-12'>
        {tableData?.friendly_name}
      </div>
      <div className='col-start-2'>
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
        <div className='flex items-center justify-between mb-6'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Operational Mode
          </label>
          <label>{tableData?.operational_mode}</label>
        </div>
        <div className='pb-3 pt-10 flex items-center justify-center uppercase'>
          <p>Operational Mode ({tableData?.operational_mode})</p>
        </div>
        <DeviceAction data={tableData} />
      </div>
    </div>
  );
}
