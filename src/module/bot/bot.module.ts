import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { IntegrationsModule } from '../integrations/integrations.module';
import { BotService } from './service/bot.service';

@Module({
  imports: [IntegrationsModule],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
