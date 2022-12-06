import Redis from 'ioredis';

let redis: any;

export const RedisConnect = () => {
  if (redis) {
    return redis;
  }

  redis = new Redis({
    port: 6379,
    host: '127.0.0.1',
    db: 0,
  });

  redis.on('error', (err: any) => console.log('Redis Client Error', err));
  // redis.connect();
  return redis;
};

export default RedisConnect;
