import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { FacebookApiService } from './whatsaap/facebookApi.service';
import { wabaService } from './whatsaap/waba.service';
import { LlmModule } from '../llm/llm.module';
import { WhatsaapManagerService } from './whatsaap/whatsaap.service';
import { WhatsappAuthService } from './whatsaap/session.service';
import { BotFatherService } from './telegram/botFather.service';

@Module({
  imports: [LlmModule],
  controllers: [IntegrationsController],
  providers: [
    FacebookApiService,
    wabaService,
    BotFatherService,
    WhatsaapManagerService,
    WhatsappAuthService,
  ],
  exports: [FacebookApiService, WhatsaapManagerService],
})
export class IntegrationsModule {}
