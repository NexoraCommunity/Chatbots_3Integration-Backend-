import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { MainGateway } from 'src/module/gateway/main.gateway';

@Injectable()
export class UserAgentEventSubscriberService implements OnModuleInit {
  constructor(
    private readonly gateway: MainGateway,
    @Inject('REDIS_SUB')
    private readonly redis: Redis,
  ) {}

  async onModuleInit() {
    await this.redis.subscribe('agent-events');

    this.redis.on('message', (_, message) => {
      const event = JSON.parse(message);

      if (event.type === 'AGENT_READY') {
        this.gateway.emitAgentStatus(event.userId, {
          userAgentId: event.userAgentId,
          status: 'READY',
        });
      }

      if (event.type === 'AGENT_FAILED') {
        this.gateway.emitAgentStatus(event.userId, {
          userAgentId: event.userAgentId,
          status: 'FAILED',
          reason: event.reason,
        });
      }
    });
  }
}
