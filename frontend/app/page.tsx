import Iot from './iot';

interface IDevice {
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

// const SERVER_URL = 'http://10.0.0.150:5000';
const SERVER_URL = 'https://iotsrv1.egeland.io';

async function fetchData() {
  const res = await fetch(`${SERVER_URL}/devices`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

const App = async () => {
  const devices: IDevice[] = await fetchData();

  return (
    <main>
      <Iot devices={devices} />
    </main>
  );
};

export default App;
