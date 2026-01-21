import { SendMessage } from 'src/model/conversation.model';
import { MessageApi } from 'src/model/message.model';
import { MessageService } from 'src/module/message/service/message.service';
import { BaileysService } from 'src/module/integrations/service/baileys/whatsaap.service';
import { BotFatherService } from 'src/module/integrations/service/botFather/botFather.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GatewayEventService } from '../gatewayEventEmiter';

@Injectable()
export class ConversationSocket {
  constructor(
    private gatewayEvent: GatewayEventService,
    private messageService: MessageService,
    private baileysService: BaileysService,
    private botFatherService: BotFatherService,
  ) {}

  async sendMessage(req: SendMessage, roomJoin: string) {
    const { humanHandle, text, type, payload, conversationId } = req;

    if (humanHandle) {
      await this.SendtoIntegration(req);
      const message: MessageApi = {
        conversationId: conversationId,
        message: {
          text: text,
          type: type,
          image: payload,
        },
        role: 'CS',
        type: type,
      };
      await this.messageService.addNewMessage(message);

      this.gatewayEvent.emitToUser(roomJoin, 'conversation', message);
    }
  }

  async SendtoIntegration(req: SendMessage) {
    const { botId, sender, integrationType, text, type, payload } = req;
    switch (integrationType) {
      case 'botFather':
        const data = await this.botFatherService.sendMessage(
          botId,
          sender,
          text,
          type,
          payload,
        );

        break;
      case 'baileys':
        await this.baileysService.sendMessage(
          botId,
          sender,
          type,
          text,
          payload,
        );
        break;

      default:
        break;
    }
  }
}
