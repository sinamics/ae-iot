import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AddUserLayout({ children }: AuthLayoutProps) {
  return (
    <div className=''>
      <Link
        href='/iot/users'
        className='absolute top-4 left-4 inline-flex items-center justify-center rounded-lg border border-gray-400 bg-transparent py-2 px-3 text-center text-sm  font-medium text-slate-300 hover:border-slate-200 hover:bg-slate-600 focus:z-10 focus:outline-none focus:ring-4 focus:ring-slate-200 md:top-8 md:left-8'
      >
        <>
          {/* <Icons.chevronLeft className='mr-2 h-4 w-4' /> */}
          Back
        </>
      </Link>
      {children}
    </div>
  );
}
