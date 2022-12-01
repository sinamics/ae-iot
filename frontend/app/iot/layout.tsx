'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider, Footer } from '@mantine/core';
import { Vertical } from '@/components/vertical';

const queryClient = new QueryClient();

export default function IotLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className='grid grid-cols-3'>
        {/* <Nav /> */}
        <div className='grid-span-1 '>
          <Vertical />
        </div>
        <div className='col-start-2 col-auto'>
          <header className='pt-10'>
            <h1 className='flex justify-center  text-3xl sm:text-4xl lg:text-6xl '>
              IoT Dashboard
            </h1>
            <p className='flex justify-center text-gray-400 mt-2'>
              Clients will report every 5min
            </p>
          </header>
          <QueryClientProvider client={queryClient}>
            <MantineProvider>{children}</MantineProvider>
          </QueryClientProvider>
        </div>
      </div>

      <div className='grid grid-cols-1'>
        <footer className='hidden absolute bottom-0 w-full p-4 shadow md:flex md:items-center md:justify-between md:p-6 bg-[rgb(54,58,63)]'>
          <span className='text-sm sm:text-center text-gray-400'>
            © 2022{' '}
            <a href='https://linkme.egeland.io' className='hover:underline'>
              Kodea Solutions™
            </a>
            . All Rights Reserved.
          </span>
          <ul className='flex flex-wrap items-center mt-3 text-sm text-gray-400 sm:mt-0'>
            <li>
              <a href='https://linkme.egeland.io/' className='hover:underline'>
                Contact
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </>
  );
}
