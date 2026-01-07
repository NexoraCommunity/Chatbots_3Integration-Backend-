import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import * as cookie from 'cookie';
import { JwtService } from '../auth/service/jwt.service';
import { PrismaService } from '../prisma/service/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class CommonGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const cookieHeader = client.handshake.headers.cookie;
      if (!cookieHeader) {
        client.disconnect();
        return;
      }

      const cookies = cookie.parse(cookieHeader);
      const token = cookies['access_token'];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verificationToken(token);

      if (!payload) return;

      const res = await this.prismaService.account.findFirst({
        where: { accessToken: token },
        include: {
          user: true,
        },
      });

      client.join(`user:${res?.user.id}`);

      console.log(
        `Socket ${client.id} connected & joined room user:${res?.user.id}`,
      );
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Socket ${client.id} disconnected`);
  }

  emitAgentStatus(userId: string, payload: any) {
    this.server.to(`user:${userId}`).emit('agent-status', payload);
  }

  emitToUser(userId: string, event: string, payload: any) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}
