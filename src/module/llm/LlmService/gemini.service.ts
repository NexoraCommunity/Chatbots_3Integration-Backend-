import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

@Injectable()
export class GeminiService {
  async createCompletions(GEMINI_API_KEY: string, model: string) {
    const GEMINI = new ChatGoogleGenerativeAI({
      model: model,
      temperature: 0,
      maxRetries: 0,
      apiKey: GEMINI_API_KEY,
    });
    return GEMINI;
  }
}
