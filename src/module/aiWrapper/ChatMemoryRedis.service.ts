import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ChatMessage } from 'src/model/Rag.model';

@Injectable()
export class ChatMemoryRedisService {
  constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}

  private key(sessionId: string) {
    return `chat:memory:${sessionId}`;
  }

  async getHistory(sessionId: string): Promise<ChatMessage[]> {
    const data = await this.redis.get(this.key(sessionId));
    return data ? JSON.parse(data) : [];
  }

  async appendMessage(sessionId: string, message: ChatMessage) {
    const history = await this.getHistory(sessionId);

    const updated = [...history, message].slice(-6);

    await this.redis.set(
      this.key(sessionId),
      JSON.stringify(updated),
      'EX',
      1800,
    );
  }

  async clear(sessionId: string) {
    await this.redis.del(this.key(sessionId));
  }

  formatChatHistory(history: ChatMessage[]) {
    return history
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');
  }
  trimHistory(history: ChatMessage[], max = 6): ChatMessage[] {
    return history.slice(-max);
  }
}
