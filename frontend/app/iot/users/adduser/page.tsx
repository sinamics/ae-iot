'use client';

import { Icons } from '@/components/icons';
import { userAuthSchema } from '@/lib/validations/auth';
import { toast } from '@/ui/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useId } from '@mantine/hooks';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type FormData = z.infer<typeof userAuthSchema>;

const AddUser = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  console.log(errors);
  async function onSubmit(data: FormData) {
    // setIsLoading(true);
    const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const s = [...Array(10)]
      .map((_) => c[~~(Math.random() * c.length)])
      .join('');

    const formdata = { ...data, password: s };

    // const response = await (
    //   await fetch('/api/auth/signup', {
    //     method: 'POST',
    //     body: JSON.stringify(formdata),
    //   })
    // ).json();

    // setIsLoading(false);
    if (true) {
      return toast({
        title: 'Something went wrong.',
        message: 'response.error',
        type: 'error',
      });
    }
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-8 grid-rows-6 h-screen'>
      <div className='col-start-4 col-span-2 row-start-1 pt-10 text-gray-400 '>
        <div className='border rounded-lg p-3 border-yellow-900'>
          <Icons.warning className='inline text-yellow-600 ' /> When adding
          user, the password is auto-generated and mailed to the person. Its
          important that they change the password when sign in first time
        </div>
      </div>
      <div className='col-start-4 col-span-2 row-start-2'>
        <form className='w-full max-w-lg' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-wrap -mx-3 mb-6'>
            <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
              <label
                className='block uppercase tracking-wide text-gray-300 text-xs font-bold mb-2'
                htmlFor='grid-first-name'
              >
                First Name
              </label>

              <input
                className='appearance-none block w-full bg-gray-200 text-gray-300 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white'
                id='grid-first-name'
                // name='firstname'
                type='text'
                placeholder='Ole'
                {...register('firstname')}
              />
              {errors?.firstname && (
                <span className='float-right px-1 text-xs text-red-600'>
                  {errors.firstname.message}
                </span>
              )}
            </div>
            <div className='w-full md:w-1/2 px-3'>
              <label
                className='block uppercase tracking-wide text-gray-300 text-xs font-bold mb-2'
                htmlFor='grid-last-name'
              >
                Last Name
              </label>

              <input
                className='appearance-none block w-full bg-gray-200 text-gray-300 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                id='grid-last-name'
                // name='lastname'
                type='text'
                placeholder='Nordmann'
                {...register('lastname')}
              />
              {errors?.lastname && (
                <span className='float-right px-1 text-xs text-red-600'>
                  {errors.lastname.message}
                </span>
              )}
            </div>
          </div>

          <div className='flex flex-wrap -mx-3 mb-6'>
            <div className='w-full px-3'>
              <label
                className='block uppercase tracking-wide text-gray-300 text-xs font-bold mb-2'
                htmlFor='grid-email'
              >
                Email
              </label>
              {errors?.email && (
                <span className='float-right px-1 text-xs text-red-600'>
                  {errors.email.message}
                </span>
              )}
              <input
                className='appearance-none block w-full bg-gray-200 text-gray-300 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                id='grid-email'
                // name='email'
                type='email'
                placeholder='ole@email.com'
                {...register('email')}
              />
            </div>
          </div>
          <div className='flex flex-wrap -mx-3 mb-6'>
            <div className='w-full px-3'>
              <label
                className='block uppercase tracking-wide text-gray-300 text-xs font-bold mb-2'
                htmlFor='grid-password'
              >
                Password
              </label>
              <p className='text-gray-400 text-xs italic'>
                {errors?.password && (
                  <span className='float-right px-1 text-xs text-red-600'>
                    {errors.password.message}
                  </span>
                )}
                Password will be auto-generated
              </p>
              <input
                className=' cursor-no-drop appearance-none block w-full bg-gray-200 text-gray-300 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                id='grid-password'
                // defaultValue={Math.random().toString(36).slice(-8)}
                disabled
                type='password'
                // name='password'
                placeholder='******************'
                // {...register('password')}
              />
            </div>
          </div>
          <div className='flex justify-end border-b border-teal-500 py-2'>
            <button
              className='flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded'
              type='submit'
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
