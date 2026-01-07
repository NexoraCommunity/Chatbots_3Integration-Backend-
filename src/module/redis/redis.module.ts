import { Global, Module } from '@nestjs/common';
import { redisClient, redisPub, redisSub } from './service/redis.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    { provide: 'REDIS_CLIENT', useValue: redisClient },
    { provide: 'REDIS_PUB', useValue: redisPub },
    { provide: 'REDIS_SUB', useValue: redisSub },
  ],
  exports: ['REDIS_CLIENT', 'REDIS_PUB', 'REDIS_SUB'],
})
export class RedisModule {}
