import { Module } from '@nestjs/common';
import { ConversationService } from './service/conversation.service';

@Module({
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
