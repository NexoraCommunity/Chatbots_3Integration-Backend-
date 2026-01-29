import { Injectable } from '@nestjs/common';
import { GeminiService } from 'src/module/llm/LlmService/gemini.service';
import { GroqService } from 'src/module/llm/LlmService/groq.service';
import { OpenRouterService } from 'src/module/llm/LlmService/openRouter.service';

@Injectable()
export class ChoosenLLmService {
  constructor(
    private readonly groqService: GroqService,
    private readonly geminiService: GeminiService,
    private readonly openRouterService: OpenRouterService,
  ) {}

  async chooseLLM(LLM: string, model: string, apiKey: string) {
    switch (LLM) {
      case 'groq':
        return this.groqService.getClient(apiKey, model);
      case 'gemini':
        return this.geminiService.getClient(apiKey, model);
      case 'openRouter':
        return this.openRouterService.getClient(apiKey, model);
      default:
        throw new Error(`Unsupported LLM provider: ${LLM}`);
    }
  }
}
