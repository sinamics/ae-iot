import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getCurrentUser } from '@/lib/session';
// import DeviceList from './(components)/deviceList';
import IotTable from './(components)/table';
import Header from './(components)/header';

import { IDevice } from '@/lib/types';
import RedisConnect from '@/lib/redis';
const redis = RedisConnect();

const devicesInDatabase = async () => {
  const redisResult: any = new Set<IDevice[]>();
  const all = await redis.scan('0', 'MATCH', 'iot*');
  for (let x = 0; x < all[1].length; x++) {
    redisResult.add(JSON.parse(await redis.get(all[1][x])));
  }
  return [...redisResult];
};

const Iot = async () => {
  const devices: any = await devicesInDatabase();

  return (
    <div>
      {/* <DeviceList devices={devices} /> */}
      <Header />
      <IotTable data={devices} />
    </div>
  );
};

export default Iot;
