import { Module } from '@nestjs/common';
import { CommonModule } from './module/common/common.module';
import { BotModule } from './module/bot/bot.module';
import { IntegrationsModule } from './module/integrations/integrations.module';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LlmModule } from './module/llm/llm.module';
import { MessageModule } from './module/message/message.module';
import { ConversationModule } from './module/conversation/conversation.module';
import { AiWrapperModule } from './module/aiWrapper/aiWrapper.module';
import { ProductModule } from './module/product/product.module';
import { CategoryModule } from './module/category/category.module';
import { userIntegrationModule } from './module/userIntegrations/userIntegration.module';
import { ContentIntegrationModule } from './module/contentIntegration/contentIntegration.module';
import { PrismaModule } from './module/prisma/prisma.module';
import { VectorModule } from './module/vector/vector.module';
import { EmbeddingModule } from './module/embedding/embedding.module';
import { QueueModule } from './module/Queue/queue.module';
import { RedisModule } from './module/redis/redis.module';
import { UserAgentModule } from './module/UserAgent/userAgent.module';

@Module({
  imports: [
    CommonModule,
    BotModule,
    LlmModule,
    ProductModule,
    IntegrationsModule,
    AuthModule,
    UserAgentModule,
    CategoryModule,
    userIntegrationModule,
    UserModule,
    AiWrapperModule,
    PassportModule.register({ session: true }),
    MessageModule,
    ConversationModule,
    ContentIntegrationModule,
    PrismaModule,
    VectorModule,
    EmbeddingModule,
    QueueModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
