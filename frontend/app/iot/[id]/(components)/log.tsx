'use client';

import { SERVER_URL } from '@/lib/config';
import { IDevice } from '@/lib/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@mantine/core';

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
  const { status: userLoading } = useSession({ required: true });

  const socket = useSocket('/api/socketio');

  const mutation: any = useMutation<any>(postActions);

  useEffect(() => {
    socket?.on(`${params.id}/logs`, (devices: any) => {
      const msg: IDevice = JSON.parse(devices);
      setLogData(msg);
    });

    return () => {
      console.log('disconnected logs');
      socket?.off(`${params.id}/logs`);
    };
  }, [socket, params.id]);

  return (
    <div className=''>
      <Button
        onClick={() =>
          mutation.mutate({
            client_id: params?.id,
            type: 'logs',
          })
        }
      >
        Fetch Logfiles
      </Button>
      <div></div>
      Logs:
      {logData && logData}
    </div>
  );
}
