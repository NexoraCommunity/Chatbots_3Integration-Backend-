import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

export const redisConnection = {
  host: 'localhost',
  port: 6379,
};

export const redisClient = new Redis(redisConnection);
export const redisPub = new Redis(redisConnection);

export const redisSub = new Redis(redisConnection);

export const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 10,
  duration: 60,
});
