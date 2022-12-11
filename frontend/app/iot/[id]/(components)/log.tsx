'use client';

import { SERVER_URL } from '@/lib/config';
import { IDevice } from '@/lib/types';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@mantine/core';
import { AutoScrollList } from '@/components/scrollIntoView';

const postActions: any = async (props: any) => {
  const response = await fetch(`${SERVER_URL}/api/iot/dispatch`, {
    method: 'POST',
    // cache: 'no-store',
    // credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({ ...props }),
  });
  return response.json();
};
export default function Log({ params }: any) {
  const [logData, setLogData] = useState<any>();
  const socket = useSocket('/api/socketio');

  const mutation: any = useMutation<any>(postActions);

  useEffect(() => {
    socket?.on(`${params.id}/logs`, (devices: any) => {
      const msg: IDevice = JSON.parse(devices);
      setLogData(msg);
    });

    return () => {
      // console.log('disconnected logs');
      socket?.off(`${params.id}/logs`);
    };
  }, [socket, params.id]);

  return (
    <div className=''>
      <Button
        className='mb-5 w-full uppercase rounded-l inline-block px-6 py-2.5 border border-gray-400 bg-transparent text-center text-sm  font-medium text-slate-300 hover:border-slate-200 hover:bg-slate-600 focus:z-10 focus:outline-none transition duration-150 ease-in-out'
        onClick={() =>
          mutation.mutate({
            client_id: params?.id,
            type: 'logs',
          })
        }
      >
        Fetch Logfiles
      </Button>
      {logData ? (
        <pre className='pb-40 bg-slate-900 h-[600px] overflow-auto flex justify-end rounded-md shadow-2xl'>
          <AutoScrollList>{logData && logData.data}</AutoScrollList>
        </pre>
      ) : null}
    </div>
  );
}
