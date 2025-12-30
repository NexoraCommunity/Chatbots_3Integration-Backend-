import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './service/bot.service';
import { LlmModule } from '../llm/llm.module';
import { userIntegrationModule } from '../userIntegrations/userIntegration.module';

@Module({
  imports: [LlmModule, userIntegrationModule],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
