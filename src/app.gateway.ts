import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleDisconnect(client: Socket) {
    console.log(`client with id ${client.id} disconnected to socket`);
  }
  handleConnection(client: Socket) {
    console.log(`client with id ${client.id} connected to socket`);
  }
}
