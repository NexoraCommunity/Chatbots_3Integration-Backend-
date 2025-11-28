import { HttpException, Injectable } from '@nestjs/common';
import { FacebookApiService } from './facebookApi.service';
import { PostMessage, WabaHook } from 'src/model/waba.model';
import { ValidationService } from 'src/module/common/validation.service';
import { PrismaService } from 'src/module/common/prisma.service';
import { AiService } from 'src/module/aiWrapper/service/aiWrapper.service';
import { ConversationWrapper } from 'src/model/aiWrapper.model';
import { IntegrationsValidation } from '../../dto/Integration.validation';

@Injectable()
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

    const findWabaAccount =
      await this.prismaService.whatsaapBussinessAccount.findFirst({
        where: {
          businessId: HookValid.wabaId,
        },
      });

    if (!findWabaAccount) throw new HttpException('Unauthorized', 400);

    const findWaba = await this.prismaService.bot.findFirst({
      where: {
        numberPhoneWaba: HookValid.numberPhoneId,
        type: 'whatsapp',
        is_active: true,
      },
    });

    if (!findWaba) return;
    const data: ConversationWrapper = {
      room: `${HookValid.numberPhoneId}${HookValid.from}`,
      botId: String(findWaba?.id),
      integrationType: 'waba',
      message: HookValid.text,
    };

    const aiResponse = await this.aiService.wrapper(data);

    const message: PostMessage = {
      type: 'text',
      message: String(aiResponse),
      numberPhoneId: String(findWaba.numberPhoneWaba),
      to: HookValid.from,
      accessToken: String(findWaba.data),
    };
    this.facebookApiService.PostMessage(message);
  }
}
