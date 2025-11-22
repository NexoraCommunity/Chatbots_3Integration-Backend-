import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { startBot } from 'src/model/bot.model';
import { Integrationservice } from './service/integration.service';
import { WebResponse } from 'src/model/web.model';

@WebSocketGateway({ cors: { origin: '*' } })
export class integrationGateway {
  constructor(private integrationService: Integrationservice) {}
  @SubscribeMessage('startBot')
  async startBot(client: Socket, req: startBot) {
    this.integrationService.startBot(req, (update) => {
      client.emit('bot', update);
    });
  }

  @SubscribeMessage('disableBot')
  async disableBot(client: Socket, req: startBot) {
    this.integrationService.disableBot(req, (update) => {
      client.emit('bot', update);
    });
  }
}
