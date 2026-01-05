import { Module } from '@nestjs/common';
import { UserAgentController } from './userAgent.controller';
import { UserAgentService } from './service/userAgent.service';
import { DocumentReaderService } from '../embedding/service/documentReader.service';
import { AiWrapperModule } from '../aiWrapper/aiWrapper.module';
import { LlmModule } from '../llm/llm.module';
import { UserAgentRateLimiter } from './userAgent.ratelimiter';
import { UserAgentEventSubscriberService } from './service/userAgentEvent.service';

@Module({
  imports: [AiWrapperModule, LlmModule],
  controllers: [UserAgentController],
  providers: [
    UserAgentService,
    DocumentReaderService,
    UserAgentRateLimiter,
    UserAgentEventSubscriberService,
  ],
})
export class UserAgentModule {}
