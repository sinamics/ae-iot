'use client';
import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider, Footer } from '@mantine/core';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <header className='pt-10'>
          <h1 className='flex justify-center  text-3xl sm:text-4xl lg:text-6xl '>
            IoT Dashboard
          </h1>
          <p className='flex justify-center text-gray-400 mt-2'>
            Clients is pinged every 5min
          </p>
        </header>
        <QueryClientProvider client={queryClient}>
          <MantineProvider>{children}</MantineProvider>
        </QueryClientProvider>

        <footer className='absolute bottom-0 w-full p-4 bg-white shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-[rgb(54,58,63)]'>
          <span className='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
            © 2022{' '}
            <a href='https://flowbite.com/' className='hover:underline'>
              Kodea Solutions™
            </a>
            . All Rights Reserved.
          </span>
          <ul className='flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0'>
            <li>
              <a href='https://linkme.egeland.io/' className='hover:underline'>
                Contact
              </a>
            </li>
          </ul>
        </footer>
      </body>
    </html>
  );
}
