import { Module } from '@nestjs/common';

import { LlmModule } from '../llm/llm.module';
import { AiService } from './service/aiWrapper.service';
import { MessageModule } from '../message/message.module';
import { ConversationModule } from '../conversation/conversation.module';
import { CustomerServiceWorkFlow } from './Workflow/customerService.workflow';
import { ChoosenLLmService } from './Workflow/service/ChoosenLLm.service';
import { RAGService } from './Workflow/service/RAG.service';

@Module({
  imports: [LlmModule, MessageModule, ConversationModule],
  providers: [
    AiService,
    CustomerServiceWorkFlow,
    ChoosenLLmService,
    RAGService,
  ],
  exports: [AiService, CustomerServiceWorkFlow],
})
export class AiWrapperModule {}
