import { Injectable } from '@nestjs/common';
import { BotFatherService } from './botFather/botFather.service';
import { BaileysService } from './baileys/whatsaap.service';
import { startBot } from 'src/model/bot.model';
import { IntegrationsValidation } from '../dto/Integration.validation';
import { ValidationService } from 'src/module/common/validation.service';
import { PrismaService } from 'src/module/common/prisma.service';
import { BotService } from 'src/module/bot/service/bot.service';

@Injectable()
export class Integrationservice {
  constructor(
    private botFatherService: BotFatherService,
    private prismaService: PrismaService,
    private baileysService: BaileysService,
    private validationService: ValidationService,
    private botService: BotService,
  ) {}

  // Bot Integrations
  async startBot(req: startBot, sendUpdate: (data: any) => void) {
    const Reqvalid: startBot = this.validationService.validate(
      IntegrationsValidation.StartBot,
      req,
    );
    const { data, type, numberPhoneWaba, botId } = Reqvalid;
    if (!Reqvalid) {
      sendUpdate({ message: 'Validation Error' });
    }

    const findBot = await this.prismaService.bot.findFirst({
      where: {
        id: botId,
      },
    });

    if (!findBot) {
      sendUpdate({ message: 'Cannot Find BotID' });
      return;
    }
    if (type === 'whatsapp' && numberPhoneWaba === undefined) {
      this.baileysService.startBot(botId, sendUpdate);
    } else if (type === 'telegram') {
      this.botFatherService.startBot(String(data), botId, sendUpdate);
    } else {
      sendUpdate({
        message: 'Bot Connected To Waba',
        data: { type: 'whatsapp', botId: req.botId },
      });
      await this.botService.updateBotStatus(req, true);
    }
  }

  async disableBot(req: startBot, sendUpdate: (data: any) => void) {
    const Reqvalid: startBot = this.validationService.validate(
      IntegrationsValidation.StartBot,
      req,
    );
    const { data, type, numberPhoneWaba, botId } = Reqvalid;
    if (!Reqvalid) {
      sendUpdate({ message: 'Validation Error' });
    }
    const findBot = await this.prismaService.bot.findFirst({
      where: {
        id: botId,
      },
    });

    if (!findBot) {
      sendUpdate({ message: 'Cannot Find BotID ' });
      return;
    }

    if (type === 'whatsapp' && numberPhoneWaba === undefined) {
      this.baileysService.disableBot(botId, sendUpdate);
    } else if (type === 'telegram') {
      this.botFatherService.disableBot(botId, sendUpdate);
    } else {
      sendUpdate({
        message: 'Bot Disconnected To Waba',
        data: { type: 'whatsapp', botId: req.botId },
      });
      await this.botService.updateBotStatus(req, false);
    }
  }
}
