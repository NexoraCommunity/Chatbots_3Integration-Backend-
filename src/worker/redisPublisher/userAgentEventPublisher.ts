import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class UserAgentEventPublisher {
  constructor(
    @Inject('REDIS_PUB')
    private readonly redis: Redis,
  ) {}
  async agentReady(userId: string, userAgentId: string) {
    await this.redis.publish(
      'agent-events',
      JSON.stringify({
        type: 'AGENT_READY',
        userId,
        userAgentId,
      }),
    );
  }

  async agentFailed(userId: string, userAgentId: string, reason?: string) {
    await this.redis.publish(
      'agent-events',
      JSON.stringify({
        type: 'AGENT_FAILED',
        userId,
        userAgentId,
        reason,
      }),
    );
  }
}
