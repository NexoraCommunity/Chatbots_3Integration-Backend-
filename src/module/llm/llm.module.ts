import { Module } from '@nestjs/common';
import { GroqService } from './LlmService/groq.service';
import { OpenAiService } from './LlmService/openAi.service';
import { GeminiService } from './LlmService/gemini.service';
@Module({
  controllers: [],
  providers: [GroqService, OpenAiService, GeminiService],
  exports: [GroqService, OpenAiService, GeminiService],
})
export class LlmModule {}
