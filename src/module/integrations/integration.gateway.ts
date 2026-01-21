import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { startBot } from 'src/model/bot.model';
import { Integrationservice } from './service/integration.service';
import { CommonGateway } from '../common/common.gateway';
import { Injectable } from '@nestjs/common';

@Injectable()
export class integrationGateway {
  constructor(
    private integrationService: Integrationservice,
    private commonGateway: CommonGateway,
  ) {}
  @SubscribeMessage('startBot')
  async startBot(
    @ConnectedSocket() client: Socket,
    @MessageBody() req: startBot,
  ) {
    const userId = client.data.userId;
    client.join(`user:${userId}`);
    this.integrationService.startBot(req, (update) => {
      this.commonGateway.emitToUser(`user:${userId}`, 'bot', update);
    });
  }

  @SubscribeMessage('disableBot')
  async disableBot(client: Socket, req: startBot) {
    const userId = client.data.userId;
    client.join(`user:${userId}`);
    this.integrationService.disableBot(req, (update) => {
      this.commonGateway.emitToUser(`user:${userId}`, 'bot', update);
    });
  }
}
