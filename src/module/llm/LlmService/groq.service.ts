import { Injectable } from '@nestjs/common';
import { ChatGroq } from '@langchain/groq';

@Injectable()
export class GroqService {
  private clients = new Map<string, ChatGroq>();

  getClient(apiKey: string, model: string) {
    const cacheKey = `${apiKey}:${model}`;
    if (this.clients.has(cacheKey)) {
      return this.clients.get(cacheKey);
    }

    const client = new ChatGroq({
      model: model,
      apiKey: apiKey,
      temperature: 0,
      maxRetries: 0,
      timeout: 30000,
    });

    this.clients.set(cacheKey, client);
    return client;
  }
}
