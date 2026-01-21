import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CommonGateway } from '../common/common.gateway';
import { AiService } from '../aiWrapper/service/aiWrapper.service';
import { ConversationWrapper } from 'src/model/aiWrapper.model';
import { TestAgent } from 'src/model/userAgent.model';
import { PrismaService } from '../prisma/service/prisma.service';
import { CryptoService } from '../common/other/crypto.service';
import { UserAgent } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class userAgentGateway {
  constructor(
    private commonGateway: CommonGateway,
    private aiWrapperService: AiService,
    private cryptoService: CryptoService,
    private prismaService: PrismaService,
  ) {}
  @SubscribeMessage('testAgent')
  async testAgent(client: Socket, req: TestAgent) {
    const userId = client.data.userId;
    client.join(`user:${userId}`);

    const agent = await this.prismaService.userAgent.findUnique({
      where: {
        id: req.agentId,
      },
    });

    const conversation: ConversationWrapper = {
      botId: 'test-agent-123',
      humanHandle: false,
      sender: 'testing',
      integrationType: 'testBot',
      message: {
        text: req.question,
        type: 'text',
      },
      room: 'test-agent-123',
    };

    if (!agent) {
      this.commonGateway.emitToUser(
        userId,
        'testAgent',
        'AgentId is not Found!!',
      );
      return;
    }
    const decryptAgent: UserAgent = {
      ...agent,
      apiKey: await this.cryptoService.decrypt(agent.apiKey),
    };

    const aiResponse = await this.aiWrapperService.wrapper(
      conversation,
      decryptAgent,
    );

    if (aiResponse?.messages.length !== undefined) {
      aiResponse.messages.map(async (e) => {
        this.commonGateway.emitToUser(userId, 'testAgent', e);
      });
    }
  }
}
