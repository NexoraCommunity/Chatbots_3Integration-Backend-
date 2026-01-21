import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MainGateway } from './main.gateway';
import { IntegrationSocket } from './service/IntegrationSocket';
import { userAgentSocket } from './service/userAgentSocket';
import { ConversationSocket } from './service/conversationSocket';
import { IntegrationsModule } from '../integrations/integrations.module';
import { AuthModule } from '../auth/auth.module';
import { AiWrapperModule } from '../aiWrapper/aiWrapper.module';
import { MessageModule } from '../message/message.module';
import { GatewayEventService } from './gatewayEventEmiter';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    IntegrationsModule,
    MessageModule,
    AuthModule,
    AiWrapperModule,
  ],
  controllers: [],
  providers: [
    MainGateway,
    IntegrationSocket,
    userAgentSocket,
    GatewayEventService,
    ConversationSocket,
  ],
  exports: [
    MainGateway,
    IntegrationSocket,
    GatewayEventService,
    userAgentSocket,
    ConversationSocket,
  ],
})
export class GatewayModule {}
