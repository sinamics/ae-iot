'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Vertical } from '@/components/navbar';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

const queryClient = new QueryClient();

interface DashboardLayoutProps {
  children?: React.ReactNode;
  session: Session;
}

export default function Wrapper({ children, session }: DashboardLayoutProps) {
  // const user = await getCurrentUser();

  // if (!user) {
  //   return notFound();
  // }

  return (
    <SessionProvider session={session}>
      <div className='flex h-screen'>
        <Vertical />
        <div className='col-start-2 col-auto relative w-full'>
          <QueryClientProvider client={queryClient}>
            <MantineProvider>{children}</MantineProvider>
          </QueryClientProvider>
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
                <a
                  href='https://linkme.egeland.io/'
                  className='hover:underline'
                >
                  Contact
                </a>
              </li>
            </ul>
          </footer>
        </div>
      </div>
    </SessionProvider>
  );
}