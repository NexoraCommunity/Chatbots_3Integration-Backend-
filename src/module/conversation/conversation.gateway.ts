import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { startBot } from 'src/model/bot.model';
import { CommonGateway } from '../common/common.gateway';
import { BaileysService } from '../integrations/service/baileys/whatsaap.service';
import { JoinRoom, SendMessage } from 'src/model/conversation.model';
import { MessageApi } from 'src/model/message.model';
import { MessageService } from '../message/service/message.service';
import { BotFatherService } from '../integrations/service/botFather/botFather.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ConversationGateway {
  constructor(
    private commonGateway: CommonGateway,
    private messageService: MessageService,
    private baileysService: BaileysService,
    private botFatherService: BotFatherService,
  ) {}
  @SubscribeMessage('conversationStart')
  async conversationStart(client: Socket, req: JoinRoom) {
    const userId = client.data.userId;
    client.join(`user:${userId}room:${req.room}`);
  }
  @SubscribeMessage('conversationEnd')
  async conversationEnd(client: Socket, req: JoinRoom) {
    const userId = client.data.userId;
    client.leave(`user:${userId}room:${req.room}`);
  }
  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, req: SendMessage) {
    const userId = client.data.userId;
    const { humanHandle, room, text, type, payload, conversationId } = req;
    client.join(`user:${userId}room:${room}`);

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

      this.commonGateway.emitToUser(
        `user:${userId}room:${req.room}`,
        'conversation',
        message,
      );
    }
  }

  async SendtoIntegration(req: SendMessage) {
    const { botId, sender, integrationType, text, type, payload } = req;
    switch (integrationType) {
      case 'botFather':
        console.log('sended');
        const data = await this.botFatherService.sendMessage(
          botId,
          sender,
          text,
          type,
          payload,
        );
        console.log(data);

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
