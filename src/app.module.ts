import { Module } from '@nestjs/common';
import { CommonModule } from './module/common/common.module';
import { BotModule } from './module/bot/bot.module';
import { IntegrationsModule } from './module/integrations/integrations.module';
import { AuthModule } from './module/auth/auth.module';
import { PromptModule } from './module/prompt/prompt.module';
import { UserModule } from './module/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LlmModule } from './module/llm/llm.module';

@Module({
  imports: [
    CommonModule,
    BotModule,
    LlmModule,
    IntegrationsModule,
    AuthModule,
    PromptModule,
    UserModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
