'use client';
import { Button } from '@mantine/core';
import Link from 'next/link';
import React from 'react';
import { SliderSetpoint } from './(components)/slider';

export default function Device({ params }: any) {
  console.log(params);
  return (
    <div className='container pt-20 grid grid-cols-3'>
      <div className='col-span-3 text-center text-2xl'>{params.id}</div>
      <div className='col-start-2'>
        <div className='mb-3'>
          <p>Set temperature setpoint</p>
        </div>
        <SliderSetpoint />
      </div>
    </div>
  );
}
