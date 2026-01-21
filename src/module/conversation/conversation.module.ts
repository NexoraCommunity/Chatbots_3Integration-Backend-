import { forwardRef, Module } from '@nestjs/common';
import { ConversationService } from './service/conversation.service';
import { ConversationController } from './conversation.controller';
import { IntegrationsModule } from '../integrations/integrations.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [forwardRef(() => IntegrationsModule), MessageModule],
  providers: [ConversationService],
  controllers: [ConversationController],
  exports: [ConversationService],
})
export class ConversationModule {}
