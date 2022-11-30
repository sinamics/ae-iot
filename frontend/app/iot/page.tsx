import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getCurrentUser } from '@/lib/session';
import DeviceList from './(components)/deviceList';
export const SERVER_URL = 'https://iotsrv1.egeland.io';
interface IDevice {
  available: boolean;
  datetime: string;
  electric_price: number;
  electric_time_to_start: string;
  friendly_name: string;
  fuel_price: number;
  fuel_time_to_start: string;
  heater: string;
  client_id: string;
  operational_mode: string;
  system: string;
  uptime: string;
}

async function fetchData() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions.pages?.signIn || '/login');
  }

  const res = await fetch(`${SERVER_URL}/devices`, { cache: 'no-store' });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

const Iot = async () => {
  const devices: IDevice[] = await fetchData();
  return (
    <div>
      <DeviceList devices={devices} />
    </div>
  );
};

export default Iot;
