import { Injectable } from '@nestjs/common';
import { ChatGroq } from '@langchain/groq';

@Injectable()
export class GroqService {
  async createCompletions(GROQ_API_KEY: string, model: string) {
    const Groq = new ChatGroq({
      model: model,
      apiKey: GROQ_API_KEY,
      temperature: 0,
      maxRetries: 0,
      timeout: 30000,
    });

    return Groq;
  }
}
