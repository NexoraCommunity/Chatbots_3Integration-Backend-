import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class OpenRouterService {
  async createCompletions(OPENROUTER_API_KEY: string, model: string) {
    const OPENAI = new ChatOpenAI({
      model: model,
      apiKey: OPENROUTER_API_KEY,
      temperature: 0,
      maxRetries: 0,
      timeout: 30000,
    });

    return OPENAI;
  }
}
