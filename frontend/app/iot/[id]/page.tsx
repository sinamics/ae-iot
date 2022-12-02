'use client';
import Link from 'next/link';
import React from 'react';

export default function Device(props: any) {
  console.log(props);
  return (
    <div>
      <Link
        href='/iot'
        className='absolute top-4 left-4 inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent py-2 px-3 text-center text-sm  font-medium text-slate-900 hover:border-slate-200 hover:bg-slate-100 focus:z-10 focus:outline-none focus:ring-4 focus:ring-slate-200 md:top-8 md:left-8'
      >
        <>
          {/* <Icons.chevronLeft className='mr-2 h-4 w-4' /> */}
          Back
        </>
      </Link>
    </div>
  );
}
