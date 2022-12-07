'use client';

import { SERVER_URL } from '@/lib/config';
import { IDevice } from '@/lib/types';
import TimeAgo from 'react-timeago';
import { useMutation } from '@tanstack/react-query';
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
  const {
    mutate,
    isLoading: postLoading,
    data,
    error,
  } = useMutation<IDevice>(postData, {
    networkMode: 'online',
  });

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    mutate(params.id);
  }, [params, mutate]);

  useEffect(() => {
    socket?.on('iotping', (devices: any) => {
      const msg: IDevice = JSON.parse(devices);
      console.log(msg);
      if (
        !devices ||
        !devices.hasOwnProperty('client_id') ||
        devices['client_id'] !== params.id
      ) {
        console.log('not valid data');
        return;
      }

      setTableData((prev: any) => ({ ...prev, ...msg }));
      console.log('new socket message', msg);
    });

    return () => {
      socket?.off('iotping');
    };
  }, [socket, data, params.id]);

  if (userLoading === 'loading' || postLoading) {
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
