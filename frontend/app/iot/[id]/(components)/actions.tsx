'use client';

import { SERVER_URL } from '@/lib/config';
import { IDevice } from '@/lib/types';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { SliderSetpoint } from '../(components)/slider';
import { Icons } from '@/components/icons';

const postData: any = async ({ client_id, action }: any) => {
  const response = await fetch(`${SERVER_URL}/api/iot/action`, {
    method: 'POST',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({ client_id, action }),
  });
  return response.json();
};

export default function DeviceAction({ data }: any) {
  const [dispatch, setDispatch] = useState({ type: '', loading: false });

  const {
    mutate,
    isLoading: postLoading,
    data: response,
    error,
  } = useMutation<IDevice>(postData, {
    networkMode: 'online',
  });

  //   if (error instanceof Error) {
  //     return <span>Error: {error?.message}</span>;
  //   }

  const actionHandler = (action: any) => {
    setDispatch({ type: action, loading: true });
    mutate({ ...action });
  };

  return (
    <>
      <div className='flex items-center justify-center w-full'>
        <div
          className='inline-flex shadow-md hover:shadow-lg focus:shadow-lg w-full '
          role='group'
        >
          <button
            type='button'
            disabled={dispatch.loading}
            onClick={() =>
              actionHandler({
                client_id: data?.client_id,
                action: {
                  operational_mode: 'electric',
                },
              })
            }
            className={`w-1/3 uppercase rounded-l inline-block px-6 py-2.5 border border-gray-400 bg-transparent text-center text-sm  font-medium text-slate-300 hover:border-slate-200 hover:bg-slate-600 focus:z-10 focus:outline-none transition duration-150 ease-in-out`}
          >
            <div className='flex items-center justify-center'>
              {dispatch.type === 'electric' && dispatch.loading && (
                <Icons.spinner
                  className={`mr-2 h-4 w-4 animate-spin  ${
                    dispatch.type === 'electric' && dispatch.loading
                      ? 'visible'
                      : 'invisible'
                  }`}
                />
              )}
              Electric
            </div>
          </button>
          <button
            type='button'
            disabled={dispatch.loading}
            onClick={() =>
              actionHandler({
                client_id: data?.client_id,
                action: {
                  operational_mode: 'auto',
                },
              })
            }
            className={`w-1/3 uppercase inline-block px-6 py-2.5 border border-gray-400 bg-transparent text-center text-sm  font-medium text-slate-300 hover:border-slate-200 hover:bg-slate-600 focus:z-10 focus:outline-none transition duration-150 ease-in-out
              ${
                data?.operational_mode === 'auto'
                  ? 'border-slate-400 bg-slate-900'
                  : ''
              }`}
          >
            <div className='flex items-center justify-center'>
              {dispatch.type === 'auto' && dispatch.loading && (
                <Icons.spinner
                  className={`mr-2 h-4 w-4 animate-spin  ${
                    dispatch.type === 'auto' && dispatch.loading
                      ? 'visible'
                      : 'invisible'
                  }`}
                />
              )}
              Auto
            </div>
          </button>
          <button
            type='button'
            onClick={() =>
              actionHandler({
                client_id: data?.client_id,
                action: {
                  operational_mode: 'fuel',
                },
              })
            }
            disabled={dispatch.loading}
            className={`w-1/3 uppercase rounded-r inline-block px-6 py-2.5 border border-gray-400 bg-transparent text-center text-sm  font-medium text-slate-300 hover:border-slate-200 hover:bg-slate-600 focus:z-10 focus:outline-none transition duration-150 ease-in-out`}
          >
            <div className='flex items-center justify-center'>
              {dispatch.type === 'fuel' && dispatch.loading && (
                <Icons.spinner
                  className={`mr-2 h-4 w-4 animate-spin  ${
                    dispatch.type === 'fuel' && dispatch.loading
                      ? 'visible'
                      : 'invisible'
                  }`}
                />
              )}
              fuel
            </div>
          </button>
        </div>
      </div>
      <div className='mb-3 mt-10 flex items-center justify-center uppercase'>
        <p>Temperature setpoint</p>
      </div>
      <SliderSetpoint />
      <div className='pt-20'>
        <div className='flex space-x-2 justify-center'>
          <button
            type='button'
            className='w-full rounded-md border border-gray-400 bg-transparent py-2 px-3 text-center text-sm  font-medium text-slate-300 hover:border-slate-200 hover:bg-slate-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-slate-400 md:top-8 md:left-8'
          >
            Commit Changes
          </button>
        </div>
      </div>
    </>
  );
}