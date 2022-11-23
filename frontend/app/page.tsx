"use client"

import { useCallback, useEffect, useState } from 'react';
import styles from './page.module.css'
import io from 'socket.io-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import ReactTimeAgo from 'react-time-ago'
import { Dropdown } from '../components/dropdown';

// const SERVER_URL="http://10.0.0.150:5000"
const SERVER_URL="https://iotsrv1.egeland.io"

const socket = io(SERVER_URL);

const iot:any = [{}]
interface IDevice {
  datetime: Date
  friendly_name: string
  heater: string
  "iot-device": string
  electric_time_to_start: string
  fuel_time_to_start: string
  uptime: string
}

const iots:any = []

const fetchData = async () =>{
  const response = await fetch(`${SERVER_URL}/devices`)
  return response.json()
}

const postData = async (data:any) => {
  const response = await fetch(`${SERVER_URL}/action`,
    { 
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data)
    })
    return response.json()

}
export default function Home() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState("");
  const [iotDevices, setIotDevices] = useState<any>([]);

  const { isLoading, isError, data, error } = useQuery({ queryKey: ['devices'], queryFn: fetchData })
  const { mutate } = useMutation(postData)

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('iot-ping', (devices) => {
      const msg: IDevice = JSON.parse(devices)
      const dev =  [...iotDevices]

      // check if device exsist in list 
      const index = iotDevices.findIndex((f:any) => f["iot-device"] === msg["iot-device"])

      // update or add
      if(index !== -1) {
        dev[index] = msg
        return setIotDevices(dev)
      }

      setIotDevices((prev:any) => [...prev, {...msg}])
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('iot-ping');
    };
  }, [iotDevices]);

  const actionHandler:any = (props:any) =>{
    mutate({...props})
  }
  
  useEffect(()=>{
    if(!data?.length) return
    setIotDevices(data)
  },[data])
  
  if(isLoading) return <div className="flex justify-center text-2xl ">Loading IoT devices...</div>

  return (
      <main>
        <div className="flex justify-center">
          {iotDevices.map((d:any,idx:any)=>{
            return <div className='mt-5' key={d["iot-device"]}>
                <div className='flex flex-col justify-between border rounded-lg m-4 p-4 w-80'>
                  <div className='flex justify-center mb-2'>
                    {d.friendly_name}
                    <Dropdown onSelect={actionHandler} clientId={d["iot-device"]} />
                    </div>
                  <div className='flex justify-between'>
                    <span>System:</span>
                    <span>{d.system}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Operational Mode:</span>
                    <span>{d.operational_mode}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Lastseen:</span>
                    <span><ReactTimeAgo date={new Date(d.datetime)} locale="en-US" /></span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Uptime:</span>
                    <span>{d.uptime}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Heater:</span>
                    <span>{d.heater}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Electric scheduled:</span>
                    <span>{d.electric_time_to_start}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Fuel scheduled:</span>
                    <span>{d.fuel_time_to_start}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Electric kWh price:</span>
                    <span>{d.electric_price}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Fuel kWh price:</span>
                    <span>{d.fuel_price}</span>
                  </div>
                </div>
              </div>
          })}
        </div>
      </main>
  )
}
