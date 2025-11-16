import { Module } from '@nestjs/common';

import { LlmModule } from '../llm/llm.module';
import { AiService } from './service/aiWrapper.service';

@Module({
  imports: [LlmModule],
  providers: [AiService],
  exports: [AiService],
})
export class IntegrationsModule {}
