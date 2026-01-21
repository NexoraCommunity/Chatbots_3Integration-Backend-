import { ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { startBot } from 'src/model/bot.model';
import { Injectable } from '@nestjs/common';
import { Integrationservice } from 'src/module/integrations/service/integration.service';
import { GatewayEventService } from '../gatewayEventEmiter';

@Injectable()
export class IntegrationSocket {
  constructor(
    private integrationService: Integrationservice,
    private gatewayEventService: GatewayEventService,
  ) {}
  async startBot(@MessageBody() req: startBot, roomJoin: string) {
    this.integrationService.startBot(req, (update) => {
      this.gatewayEventService.emitToUser(roomJoin, 'bot', update);
    });
  }

  async disableBot(@MessageBody() req: startBot, roomJoin: string) {
    this.integrationService.disableBot(req, (update) => {
      this.gatewayEventService.emitToUser(roomJoin, 'bot', update);
    });
  }
}
