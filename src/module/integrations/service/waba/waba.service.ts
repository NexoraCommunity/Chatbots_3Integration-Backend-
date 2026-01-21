import { HttpException, Injectable } from '@nestjs/common';
import { FacebookApiService } from './facebookApi.service';
import { PostMessage, WabaHook } from 'src/model/waba.model';
import { ValidationService } from 'src/module/common/other/validation.service';
import { PrismaService } from 'src/module/prisma/service/prisma.service';
import { AiService } from 'src/module/aiWrapper/service/aiWrapper.service';
import { ConversationWrapper } from 'src/model/aiWrapper.model';
import { IntegrationsValidation } from '../../dto/Integration.validation';
import { WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({ cors: { origin: '*' } })
export class WabaService {
  constructor(
    private facebookApiService: FacebookApiService,
    private validationService: ValidationService,
    private prismaService: PrismaService,
    private aiService: AiService,
  ) {}

  async sendMessage(req: WabaHook) {
    const HookValid: WabaHook = this.validationService.validate(
      IntegrationsValidation.WabaHook,
      req,
    );

    if (!HookValid) throw new HttpException('Validation Error', 400);

    // Next Chache

    const findWabaAccount =
      await this.prismaService.whatsaapBussinessAccount.findFirst({
        where: {
          businessId: HookValid.wabaId,
        },
      });

    if (!findWabaAccount) throw new HttpException('Unauthorized', 400);

    const bot = await this.prismaService.bot.findFirst({
      where: {
        numberPhoneWaba: HookValid.numberPhoneId,
        type: 'whatsapp Bussiness',
        isActive: true,
      },
      include: {
        agent: true,
      },
    });

    let update = {
      message: `new message from ${HookValid.from}`,
      botId: bot?.id,
      type: 'Whatsaap Bussiness',
    };

    // this.commonGateway.emitToUser(`user:${bot?.agent.userId}`, 'bot', update);
    if (!bot) return;

    const data: ConversationWrapper = {
      room: `${HookValid.numberPhoneId}${HookValid.from}`,
      botId: String(bot?.id),
      integrationType: 'waba',
      sender: HookValid.numberPhoneId,
      humanHandle: false,
      message: {
        text: HookValid.text,
        type: 'text',
      },
    };

    const aiResponse = await this.aiService.wrapper(data, bot?.agent);

    const message: PostMessage = {
      type: 'text',
      message: String(aiResponse),
      numberPhoneId: String(bot.numberPhoneWaba),
      to: HookValid.from,
      accessToken: String(bot.data),
    };
    this.facebookApiService.PostMessage(message);
  }
}
