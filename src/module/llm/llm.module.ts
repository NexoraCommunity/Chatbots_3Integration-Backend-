import { Module } from '@nestjs/common';
import { GroqService } from './LlmService/groq.service';
import { OpenRouterService } from './LlmService/openRouter.service';
import { GeminiService } from './LlmService/gemini.service';
import { LlmController } from './llm.controller';
import { LlmService } from './LlmService/llm.service';
@Module({
  controllers: [LlmController],
  providers: [GroqService, OpenRouterService, GeminiService, LlmService],
  exports: [GroqService, OpenRouterService, GeminiService],
})
export class LlmModule {}
