import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

@Injectable()
export class GeminiService {
  private clients = new Map<string, ChatGoogleGenerativeAI>();

  getClient(apiKey: string, model: string) {
    const normalizedModel = model.replace('models/', '');

    const cacheKey = `${apiKey}:${normalizedModel}`;
    if (this.clients.has(cacheKey)) {
      return this.clients.get(cacheKey);
    }

    const client = new ChatGoogleGenerativeAI({
      model: normalizedModel,
      temperature: 0,
      apiKey,
      maxRetries: 2,
    });

    this.clients.set(cacheKey, client);
    return client;
  }
}
