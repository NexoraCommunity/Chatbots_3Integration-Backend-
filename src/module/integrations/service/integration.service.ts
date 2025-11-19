import { Injectable } from '@nestjs/common';
import { BotFatherService } from './botFather/botFather.service';
import { BaileysService } from './baileys/whatsaap.service';
import { ResponseBot, startBot } from 'src/model/bot.model';
import { IntegrationsValidation } from '../dto/Integration.validation';
import { ValidationService } from 'src/module/common/validation.service';
import { PrismaService } from 'src/module/common/prisma.service';
import { WebResponse } from 'src/model/web.model';

@Injectable()
export class Integrationservice {
  constructor(
    private botFatherService: BotFatherService,
    private prismaService: PrismaService,
    private baileysService: BaileysService,
    private validationService: ValidationService,
  ) {}

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
      return;
    } else if (type === 'telegram') {
      this.botFatherService.startBot(String(data), botId, sendUpdate);
      return;
    } else {
      sendUpdate({
        message: 'Bot Connected To Waba',
        data: { type: 'whatsapp', botId: req.botId },
      });
    }
    await this.updateBotStatus(req, false);
  }

  async updateBotStatus(req: startBot, status: boolean) {
    await this.prismaService.bot.update({
      where: {
        id: req.botId,
      },
      data: {
        is_active: !status,
        data: req.data,
        numberPhoneWaba: req.numberPhoneWaba,
      },
    });
  }
  disableBot() {}
}
