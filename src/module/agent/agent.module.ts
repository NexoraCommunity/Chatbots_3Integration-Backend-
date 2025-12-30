import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './service/agent.service';
import { DocumentReaderService } from './documentReader/documentReader.service';
import { AiWrapperModule } from '../aiWrapper/aiWrapper.module';

@Module({
  imports: [AiWrapperModule],
  controllers: [AgentController],
  providers: [AgentService, DocumentReaderService],
})
export class AgentModule {}
