import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

export const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
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
