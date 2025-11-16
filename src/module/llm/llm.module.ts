import { Module } from '@nestjs/common';
import { GroqService } from './LlmService/groq.service';
@Module({
  controllers: [],
  providers: [GroqService],
  exports: [GroqService],
})
export class LlmModule {}
