import IotTable from './(components)/dashboardTable';
import Header from './(components)/header';

import { IDevice } from '@/lib/types';
import RedisConnect from '@/lib/redis';
const redis = RedisConnect();

const devicesInDatabase = async () => {
  const redisResult: Set<IDevice> = new Set();
  try {
    const all = await redis.scan('0', 'MATCH', 'iot*');
    for (let x = 0; x < all[1].length; x++) {
      const device = JSON.parse((await redis.get(all[1][x])) as string);
      if (device) {
        redisResult.add(device);
      }
    }
  } catch (error) {
    // Handle the error
  }
  return Array.from(redisResult);
};

const Dashboard = async () => {
  const devices: any = await devicesInDatabase();

  return (
    <div>
      {/* <DeviceList devices={devices} /> */}
      <Header />
      <IotTable data={devices} />
    </div>
  );
};

export default Dashboard;
