import { Module } from '@nestjs/common';
import { PromptController } from './prompt.controller';
import { PromptService } from './service/prompt.service';
import { DocumentReaderService } from './documentReader/documentReader.service';
import { AiWrapperModule } from '../aiWrapper/aiWrapper.module';

@Module({
  imports: [AiWrapperModule],
  controllers: [PromptController],
  providers: [PromptService, DocumentReaderService],
})
export class PromptModule {}
