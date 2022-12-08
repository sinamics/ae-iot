'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Vertical } from '@/components/navbar';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { Footer } from '@/components/footer';

const queryClient = new QueryClient();

interface DashboardLayoutProps {
  children?: React.ReactNode;
  session: Session;
}

export default function Wrapper({ children, session }: DashboardLayoutProps) {
  return (
    <SessionProvider session={session}>
      <div className='flex h-screen'>
        <Vertical />
        <div className='col-start-2 col-auto relative w-full select-none'>
          <QueryClientProvider client={queryClient}>
            <MantineProvider>{children}</MantineProvider>
          </QueryClientProvider>
          <Footer />
        </div>
      </div>
    </SessionProvider>
  );
}
