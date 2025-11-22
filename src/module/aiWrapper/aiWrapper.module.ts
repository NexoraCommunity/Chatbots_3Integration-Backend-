import { Module } from '@nestjs/common';

import { LlmModule } from '../llm/llm.module';
import { AiService } from './service/aiWrapper.service';
import { MessageModule } from '../message/message.module';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [LlmModule, MessageModule, ConversationModule],
  providers: [AiService],
  exports: [AiService],
})
export class AiWrapperModule {}
