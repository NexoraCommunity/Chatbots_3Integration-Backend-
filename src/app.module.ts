import { Module } from '@nestjs/common';
import { CommonModule } from './module/common/common.module';
import { BotModule } from './module/bot/bot.module';
import { IntegrationsModule } from './module/integrations/integrations.module';
import { AuthModule } from './module/auth/auth.module';
import { PromptModule } from './module/prompt/prompt.module';
import { UserModule } from './module/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LlmModule } from './module/llm/llm.module';
import { MessageModule } from './module/message/message.module';
import { ConversationModule } from './module/conversation/conversation.module';
import { AppGateway } from './app.gateway';
import { AiWrapperModule } from './module/aiWrapper/aiWrapper.module';
import { ProductModule } from './module/product/product.module';
import { CategoryModule } from './module/category/category.module';
import { userIntegrationModule } from './module/userIntegrations/userIntegration.module';
import { ContentIntegrationModule } from './module/contentIntegration/contentIntegration.module';

@Module({
  imports: [
    CommonModule,
    BotModule,
    LlmModule,
    ProductModule,
    IntegrationsModule,
    AuthModule,
    PromptModule,
    CategoryModule,
    userIntegrationModule,
    UserModule,
    AiWrapperModule,
    PassportModule.register({ session: true }),
    MessageModule,
    ConversationModule,
    ContentIntegrationModule,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
