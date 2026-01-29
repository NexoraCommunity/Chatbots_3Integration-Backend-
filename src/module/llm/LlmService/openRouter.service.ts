import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class OpenRouterService {
  private clients = new Map<string, ChatOpenAI>();

  getClient(apiKey: string, model: string) {
    const cacheKey = `${apiKey}:${model}`;
    if (this.clients.has(cacheKey)) {
      return this.clients.get(cacheKey);
    }

    const client = new ChatOpenAI({
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
