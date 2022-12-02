import { LoginForm } from '@/components/dashboard/login-form';

export default function LoginPage() {
  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          {/* <Icons.logo className='mx-auto h-6 w-6' /> */}
          <h1 className='text-2xl font-bold'>Welcome back</h1>
          <p className='text-sm text-slate-300'>
            Enter your email and password to sign in to your account
          </p>
        </div>
        <LoginForm />
        {/* <p className='px-8 text-center text-sm text-slate-600'>
          <Link href='/register' className='underline hover:text-brand'>
            Don&apos;t have an account? Sign Up
          </Link>
        </p> */}
      </div>
    </div>
  );
}
