import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { FacebookApiService } from './service/waba/facebookApi.service';
import { WabaService } from './service/waba/waba.service';
import { LlmModule } from '../llm/llm.module';
import { BaileysService } from './service/baileys/whatsaap.service';
import { WhatsappAuthService } from './service/baileys/session.service';
import { BotFatherService } from './service/botFather/botFather.service';
import { MessageModule } from '../message/message.module';
import { ConversationModule } from '../conversation/conversation.module';
import { AiWrapperModule } from '../aiWrapper/aiWrapper.module';
import { integrationGateway } from './integration.gateway';
import { Integrationservice } from './service/integration.service';

@Module({
  imports: [LlmModule, MessageModule, ConversationModule, AiWrapperModule],
  controllers: [IntegrationsController],
  providers: [
    FacebookApiService,
    WabaService,
    BotFatherService,
    integrationGateway,
    BaileysService,
    Integrationservice,
    WhatsappAuthService,
  ],
  exports: [FacebookApiService, BaileysService],
})
export class IntegrationsModule {}
