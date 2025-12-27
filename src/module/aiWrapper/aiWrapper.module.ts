import { Module } from '@nestjs/common';

import { LlmModule } from '../llm/llm.module';
import { AiService } from './service/aiWrapper.service';
import { MessageModule } from '../message/message.module';
import { ConversationModule } from '../conversation/conversation.module';
import { vectorStoreService } from './RagService/vectoreStore.service';
import { XenovaEmbeddings } from './RagService/xenovaEmbbeding.service';

@Module({
  imports: [LlmModule, MessageModule, ConversationModule],
  providers: [AiService, vectorStoreService, XenovaEmbeddings],
  exports: [AiService, vectorStoreService, XenovaEmbeddings],
})
export class AiWrapperModule {}
