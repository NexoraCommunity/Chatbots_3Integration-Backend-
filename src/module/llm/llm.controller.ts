import { Controller, Get } from '@nestjs/common';
import { LlmService } from './LlmService/llm.service';

@Controller('api')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Get('llm')
  async getAllModels() {
    return this.llmService.getTextLLMModels();
  }
}
