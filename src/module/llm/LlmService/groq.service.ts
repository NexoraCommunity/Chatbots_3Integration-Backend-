import { Injectable } from '@nestjs/common';
import { ChatGroq } from '@langchain/groq';
import { ConversationWrapper } from 'src/model/aiWrapper.model';

@Injectable()
export class GroqService {
  constructor() {}

  async createCompletions(req: ConversationWrapper) {
    const GROQ_API_KEY = '';
    const Groq = new ChatGroq({
      model: 'llama-3.3-70b-versatile',
      apiKey: GROQ_API_KEY,
      temperature: 0,
      maxRetries: 0,
      timeout: 2,
    });

    return Groq;
  }
}
