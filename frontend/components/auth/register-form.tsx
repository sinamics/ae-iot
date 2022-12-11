'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import { userAuthSchema } from '@/lib/validations/auth';
import { toast } from '@/ui/toast';
// import { Icons } from '@/components/icons';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>;

export function RegisterForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const response = await (
      await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    ).json();

    setIsLoading(false);
    if (response.error) {
      return toast({
        title: 'Something went wrong.',
        message: response.error,
        type: 'error',
      });
    }

    // return toast({
    //   title: 'Check your email',
    //   message: 'We sent you a login link. Be sure to check your spam too.',
    //   type: 'success',
    // });
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <label className='sr-only' htmlFor='email'>
              Email
            </label>
            <input
              id='email'
              placeholder='email'
              className='my-0 mb-2 block h-9 w-full rounded-md border border-slate-300 py-2 px-3 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-1'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading}
              {...register('email')}
              name='email'
            />
            {errors?.email && (
              <p className='px-1 text-xs text-red-600'>
                {errors.email.message}
              </p>
            )}
          </div>
          <div className='grid gap-1'>
            <label className='sr-only' htmlFor='email'>
              password
            </label>
            <input
              id='password'
              placeholder='password'
              className='my-0 mb-2 block h-9 w-full rounded-md border border-slate-300 py-2 px-3 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-1'
              type='password'
              autoCapitalize='none'
              autoComplete='password'
              autoCorrect='off'
              disabled={isLoading}
              {...register('password')}
              name='password'
            />
            {errors?.password && (
              <p className='px-1 text-xs text-red-600'>
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            className='inline-flex w-full items-center justify-center rounded-lg bg-[#24292F] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#24292F]/90 focus:outline-none focus:ring-4 focus:ring-[#24292F]/50 disabled:opacity-50 dark:hover:bg-[#050708]/30 dark:focus:ring-slate-500'
            disabled={isLoading}
          >
            {isLoading && (
              //   <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              <div>Loading</div>
            )}
            Sign In with Email
          </button>
        </div>
      </form>
    </div>
  );
}
