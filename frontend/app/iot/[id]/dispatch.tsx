'use client';
import { SERVER_URL } from '@/lib/config';
import { IDevice } from '@/lib/types';
import { parseMutationArgs, useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { SliderSetpoint } from './(components)/slider';
import { Icons } from '@/components/icons';
import { Checkbox, Divider, Input } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons';

const postActions: any = async (props: any) => {
  const response = await fetch(`${SERVER_URL}/api/iot/dispatch`, {
    method: 'POST',
    // cache: 'no-store',
    // credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({ ...props }),
  });
  return response.json();
};

export default function DeviceAction({
  iotDataProps,
}: {
  iotDataProps: IDevice;
}) {
  const [defaultValue, setDefaultValue] = useState({
    fuel_kwh_price: Number(0),
    temperature_setpoint: Number(0),
    electric_gpio_output_pin: Number(0),
    fuel_gpio_output_pin: Number(0),
    temperature_setpoint_gpio_output_pin: Number(0),
  });
  const [iotData, setIotData] = useState(iotDataProps);
  const [dispatch, setDispatch] = useState({
    type: '',
    loading: true,
    error: '',
  });

  const mutation = useMutation<IDevice>(postActions, {
    onSuccess: () => {
      setTimeout(() => {
        setDispatch((prev: any) => ({ ...prev, loading: false }));
      }, 2000);
    },
    onError: (error) => {
      setDispatch((prev: any) => ({ ...prev, loading: false, error }));
    },
  });

  useEffect(() => {
    if (!iotDataProps) return;

    setIotData(iotDataProps);
    setDefaultValue(iotDataProps);
  }, [iotDataProps]);

  if (mutation.isError && mutation.error instanceof Error) {
    return <span>Error: {mutation.error?.message}</span>;
  }

  const actionHandler = (iot: any) => {
    setDispatch((prev) => ({
      ...prev,
      type: iot.action.operational_mode,
      loading: true,
    }));
    // console.log(iot);
    mutation.mutate({ ...iot });
  };

  const sliderHandler = (name: string, value: number) => {
    setDefaultValue((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Divider my='md' label='Settings' labelPosition='center' />

      <section className='mt-10'>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 '
            htmlFor='inline-full-name'
          >
            Debug
            <small className='block font-light'>
              Provides more verbose output in logfiles. <br />
              Should be disabled as default to avoid growing logfiles.
            </small>
          </label>
          <label>
            <Checkbox
              checked={iotData?.debug}
              onChange={(event: any) =>
                actionHandler({
                  client_id: iotData?.client_id,
                  type: 'update',
                  action: {
                    debug: event.currentTarget.checked,
                  },
                })
              }
              // onChange={(event) =>
              //   checkboxHandler(event.currentTarget.checked, { name: 'debug', type: "update"})
              // }
            />
          </label>
        </div>
      </section>
      <section className='mt-10'>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 w-2/4'
            htmlFor='inline-full-name'
          >
            Fuel Price
            <small className='block font-light'>
              Adjust the fuel price for this IoI device
            </small>
          </label>
          <div className='w-2/4'>
            <SliderSetpoint
              min={10}
              max={800}
              defaultValue={iotData?.fuel_kwh_price}
              onChange={(e: number) => sliderHandler('fuel_kwh_price', e)}
            />
            {iotData?.fuel_kwh_price !== defaultValue?.fuel_kwh_price ? (
              <button
                type='button'
                onClick={() =>
                  actionHandler({
                    client_id: iotData?.client_id,
                    type: 'update',
                    action: {
                      fuel_kwh_price: defaultValue?.fuel_kwh_price,
                    },
                  })
                }
                className='mt-3 w-full uppercase rounded-l inline-block px-6 py-1.5 border border-gray-400 bg-transparent text-center text-sm  font-medium text-slate-300 hover:border-slate-200 hover:bg-slate-600 focus:z-10 focus:outline-none transition duration-150 ease-in-out'
              >
                Submit Changes
              </button>
            ) : null}
          </div>
        </div>
      </section>
      <section className='mt-10'>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 w-2/4'
            htmlFor='inline-full-name'
          >
            Temperature Setpoint
            <small className='block font-light'>
              Adjust the temperature setpoint for this IoI heater device
            </small>
          </label>
          <div className='w-2/4'>
            <SliderSetpoint
              min={10}
              max={120}
              defaultValue={iotData?.temperature_setpoint}
              onChange={(e: number) => sliderHandler('temperature_setpoint', e)}
            />
            {iotData?.temperature_setpoint !==
            defaultValue?.temperature_setpoint ? (
              <button
                type='button'
                onClick={(event: any) =>
                  actionHandler({
                    client_id: iotData?.client_id,
                    type: 'update',
                    action: {
                      temperature_setpoint: parseInt(event.currentTarget.value),
                    },
                  })
                }
                className='mt-3 w-full uppercase rounded-l inline-block px-6 py-1.5 border border-gray-400 bg-transparent text-center text-sm  font-medium text-slate-300 hover:border-slate-200 hover:bg-slate-600 focus:z-10 focus:outline-none transition duration-150 ease-in-out'
              >
                Submit Changes
              </button>
            ) : null}
          </div>
        </div>
      </section>
      <section className='mt-10'>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 w-3/4'
            htmlFor='inline-full-name'
          >
            Fuel Output Pin
            <small className='block font-light'>
              Set the GPIO pin number to be HIGH when fuel heater should be used
            </small>
          </label>
          <div className='w-1/4'>
            <Input
              className='w-full'
              value={iotData?.fuel_gpio_output_pin}
              component='select'
              rightSection={<IconChevronDown size={14} stroke={1.5} />}
              onChange={(event) =>
                actionHandler({
                  client_id: iotData?.client_id,
                  type: 'update',
                  action: {
                    fuel_gpio_output_pin: parseInt(event.currentTarget.value),
                  },
                })
              }
            >
              {new Array(200).fill('').map((v, idx) => {
                return (
                  <option key={idx} value={idx}>
                    {idx}
                  </option>
                );
              })}
            </Input>
          </div>
        </div>
      </section>
      <section className='mt-10'>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 w-3/4'
            htmlFor='inline-full-name'
          >
            Electric Output Pin
            <small className='block font-light'>
              Set the GPIO pin number to be HIGH when electric heater should be
              used
            </small>
          </label>
          <div className='w-1/4'>
            <Input
              value={iotData?.electric_gpio_output_pin}
              className='w-full'
              component='select'
              rightSection={<IconChevronDown size={14} stroke={1.5} />}
              onChange={(event: any) =>
                actionHandler({
                  client_id: iotData?.client_id,
                  type: 'update',
                  action: {
                    electric_gpio_output_pin: parseInt(
                      event.currentTarget.value
                    ),
                  },
                })
              }
            >
              {new Array(200).fill('').map((v, idx) => {
                return (
                  <option key={idx} value={idx}>
                    {idx}
                  </option>
                );
              })}
            </Input>
          </div>
        </div>
      </section>
      <section className='mt-10'>
        <div className='flex items-center justify-between'>
          <label
            className='block text-gray-300 font-bold mb-1 w-3/4'
            htmlFor='inline-full-name'
          >
            Temperature Setpoint Pin
            <small className='block font-light'>
              Set the GPIO pin number to be used for temperature setpoint
            </small>
          </label>
          <div className='w-1/4'>
            <Input
              value={iotData?.temperature_setpoint_gpio_output_pin}
              className='w-full'
              component='select'
              rightSection={<IconChevronDown size={14} stroke={1.5} />}
              onChange={(event: any) =>
                actionHandler({
                  client_id: iotData?.client_id,
                  type: 'update',
                  action: {
                    temperature_setpoint_gpio_output_pin: parseInt(
                      event.currentTarget.value
                    ),
                  },
                })
              }
            >
              {new Array(200).fill('').map((_, idx: number) => {
                return (
                  <option key={idx} value={idx}>
                    {idx}
                  </option>
                );
              })}
            </Input>
          </div>
        </div>
      </section>
      <div className='pb-3 pt-10 flex items-center justify-center uppercase'>
        <p>Operational Mode ({iotData?.operational_mode})</p>
      </div>
      <div className='flex items-center justify-center w-full'>
        <div
          className='inline-flex shadow-sky-800/100 shadow-2xl focus:shadow-2xl w-full '
          role='group'
        >
          <button
            type='button'
            // disabled={dispatch.loading}
            onClick={() =>
              actionHandler({
                client_id: iotData?.client_id,
                type: 'update',
                action: {
                  operational_mode: 'electric',
                },
              })
            }
            className={`w-1/3 uppercase rounded-l inline-block px-6 py-2.5 border border-gray-400 bg-transparent text-center text-sm  font-medium text-slate-300 hover:border-slate-200 hover:bg-slate-600 focus:z-10 focus:outline-none transition duration-150 ease-in-out
            ${
              iotData?.operational_mode === 'electric'
                ? 'border-slate-400 bg-sky-900'
                : ''
            }`}
          >
            <div className='flex items-center justify-center'>
              {dispatch.type === 'electric' && dispatch.loading && (
                <Icons.spinner
                  className={`mr-2 h-4 w-4 animate-spin  ${
                    dispatch.type === 'electric' && dispatch.loading
                      ? 'visible'
                      : 'invisible'
                  }`}
                />
              )}
              Electric
            </div>
          </button>
          <button
            type='button'
            // disabled={dispatch.loading}
            onClick={() =>
              actionHandler({
                client_id: iotData?.client_id,
                type: 'update',
                action: {
                  operational_mode: 'auto',
                },
              })
            }
            className={`w-1/3 uppercase inline-block px-6 py-2.5 border border-gray-400 bg-transparent text-center text-sm  font-medium text-slate-300 hover:border-slate-200 hover:bg-slate-600 focus:z-10 focus:outline-none transition duration-150 ease-in-out
              ${
                iotData?.operational_mode === 'auto'
                  ? 'border-slate-400 bg-sky-900'
                  : ''
              }`}
          >
            <div className='flex items-center justify-center'>
              {dispatch.type === 'auto' && dispatch.loading && (
                <Icons.spinner
                  className={`mr-2 h-4 w-4 animate-spin  ${
                    dispatch.type === 'auto' && dispatch.loading
                      ? 'visible'
                      : 'invisible'
                  }`}
                />
              )}
              Auto
            </div>
          </button>
          <button
            type='button'
            // disabled={dispatch.loading}
            onClick={() =>
              actionHandler({
                client_id: iotData?.client_id,
                type: 'update',
                action: {
                  operational_mode: 'stopp',
                },
              })
            }
            className={`w-1/3 uppercase inline-block px-6 py-2.5 border border-gray-400 bg-transparent text-center text-sm  font-medium text-slate-300 hover:border-slate-200 hover:bg-slate-600 focus:z-10 focus:outline-none transition duration-150 ease-in-out
              ${
                iotData?.operational_mode === 'stopp'
                  ? 'border-slate-400 bg-sky-900'
                  : ''
              }`}
          >
            <div className='flex items-center justify-center'>
              {dispatch.type === 'stopp' && dispatch.loading && (
                <Icons.spinner
                  className={`mr-2 h-4 w-4 animate-spin  ${
                    dispatch.type === 'stopp' && dispatch.loading
                      ? 'visible'
                      : 'invisible'
                  }`}
                />
              )}
              Stopp
            </div>
          </button>
          <button
            type='button'
            onClick={() =>
              actionHandler({
                client_id: iotData?.client_id,
                type: 'update',
                action: {
                  operational_mode: 'fuel',
                },
              })
            }
            // disabled={dispatch.loading}
            className={`w-1/3 uppercase rounded-r inline-block px-6 py-2.5 border border-gray-400 bg-transparent text-center text-sm  font-medium text-slate-300 hover:border-slate-200 hover:bg-slate-600 focus:z-10 focus:outline-none transition duration-150 ease-in-out
            ${
              iotData?.operational_mode === 'fuel'
                ? 'border-slate-400 bg-sky-900'
                : ''
            }`}
          >
            <div className='flex items-center justify-center'>
              {dispatch.type === 'fuel' && dispatch.loading && (
                <Icons.spinner
                  className={`mr-2 h-4 w-4 animate-spin  ${
                    dispatch.type === 'fuel' && dispatch.loading
                      ? 'visible'
                      : 'invisible'
                  }`}
                />
              )}
              fuel
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
