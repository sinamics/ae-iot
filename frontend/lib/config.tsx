const isDev = process.env.NODE_ENV !== 'production';

export const SERVER_URL = isDev
  ? 'http://localhost:3001'
  : 'https://iotsrv1.egeland.io';
