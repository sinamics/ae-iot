import Redis from 'ioredis';

let redis: any;

export const RedisConnect = () => {
  if (redis) {
    return redis;
  }

  redis = new Redis({
    port: 49154,
    host: '10.0.0.150',
    db: 0,
  });

  redis.on('error', (err: any) => console.log('Redis Client Error', err));
  // redis.connect();
  return redis;
};

export default RedisConnect;
