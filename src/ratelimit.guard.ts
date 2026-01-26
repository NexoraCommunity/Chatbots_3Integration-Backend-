import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress;

    const key = `rate:ip:${ip}`;
    const count = await this.redis.incr(key);

    if (count === 1) {
      await this.redis.expire(key, 10);
    }

    if (count > 5) {
      throw new HttpException('Too many request, please wait 10 second', 429);
    }

    return true;
  }
}
