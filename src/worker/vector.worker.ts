import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { redisConnection } from 'src/module/redis/service/redis.service';
import { UserAgentVectorIngestionService } from './ingestion/UserAgentVectorIngestion.service';

@Injectable()
export class VectorWorkerService
  implements OnModuleInit, OnApplicationShutdown
{
  private worker: Worker;

  constructor(
    private readonly userAgentVectorIngestionService: UserAgentVectorIngestionService,
  ) {}

  onModuleInit() {
    this.worker = new Worker(
      'vector-ingest',
      async (job: Job) => {
        switch (job.name) {
          case 'INGEST_AGENT':
            return this.userAgentVectorIngestionService.ingestAgent(job);

          case 'DEGEST_AGENT':
            return this.userAgentVectorIngestionService.DegestAgent(job);
        }
        await this.userAgentVectorIngestionService.ingestAgent(job);
      },
      {
        connection: redisConnection,
        concurrency: 2,
      },
    );
    this.worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed:`, err);
    });
  }

  onApplicationShutdown(signal?: string) {
    if (this.worker) {
      this.worker.close();
    }
  }
}
