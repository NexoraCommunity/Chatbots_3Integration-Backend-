import { Queue } from 'bullmq';
import { redisConnection } from '../../redis/service/redis.service';

export const vectorIngestQueue = new Queue('vector-ingest', {
  connection: redisConnection,
});

export { redisConnection };
