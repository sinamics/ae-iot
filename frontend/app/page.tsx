import Iot from './iot';

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
  const devices = await fetchData();

  return (
    <main>
      <Iot devices={devices} />
    </main>
  );
};

export default App;
