import { HttpException, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class UserAgentRateLimiter {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}
  async check(userId: string) {
    const key = `rate:add-agent:${userId}`;
    const count = await this.redis.incr(key);

    if (count === 1) {
      await this.redis.expire(key, 300);
    }

    if (count > 3) {
      throw new HttpException(
        'Too many agents created, please wait 5 minute',
        429,
      );
    }
  }
}
