'use client';

import { SERVER_URL } from '@/lib/config';
import { IDevice } from '@/lib/types';
import TimeAgo from 'react-timeago';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { SliderSetpoint } from './(components)/slider';
import { Icons } from '@/components/icons';
import DeviceAction from './(components)/actions';

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
  const [dispatch, setDispatch] = useState({ type: '', loading: false });
  const { status: userLoading } = useSession({ required: true });

  const {
    mutate,
    isLoading: postLoading,
    data,
    error,
  } = useMutation<IDevice>(postData, {
    networkMode: 'online',
  });

  useEffect(() => {
    mutate(params.id);
  }, [params, mutate]);

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

  const actionHandler = (action: any) => {
    setDispatch({ type: action, loading: true });
  };

  return (
    <div className='container pt-20 grid grid-cols-3'>
      <div className='col-span-3 text-center text-4xl p-12'>
        {data?.friendly_name}
      </div>
      <div className='col-start-2'>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Name
          </label>
          <label>{data?.friendly_name}</label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Client ID
          </label>
          <label>{data?.client_id}</label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Lastseen
          </label>
          <label>
            <TimeAgo date={new Date(data?.datetime || 0)} />
          </label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Uptime
          </label>
          <label>{data?.uptime}</label>
        </div>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Heater
          </label>
          <label>{data?.heater}</label>
        </div>
        <div className='flex items-center justify-between mb-6'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Operational Mode
          </label>
          <label>{data?.operational_mode}</label>
        </div>
        <div className='pb-3 pt-10 flex items-center justify-center uppercase'>
          <p>Operational Mode ({data?.operational_mode})</p>
        </div>
        <DeviceAction data={data} />
      </div>
    </div>
  );
}
