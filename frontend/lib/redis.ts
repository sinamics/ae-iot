import Redis from 'ioredis';

let redis: Redis;

export const RedisConnect = (): Redis => {
  if (redis) {
    return redis;
  }

  try {
    redis = new Redis({
      port: 6379,
      host: '127.0.0.1',
      db: 0,
    });

    redis.on('error', (err: any) => {
      // Handle Redis client errors
      console.error('Redis Client Error:', err);
    });
  } catch (error) {
    // Handle any other errors that may occur while connecting to Redis
    console.error('Redis Connection Error:', error);
  }

  return redis;
};

export default RedisConnect;
