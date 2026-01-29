import { Global, Module } from '@nestjs/common';
import { XenovaEmbeddings } from './service/xenovaEmbbeding.service';
import { DocumentReaderService } from './service/documentReader.service';
import { OtherEmbedding } from './service/otherEmbbeding.service';
import { OpenAiEmbbedingService } from './service/openAIEmbedding.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    XenovaEmbeddings,
    DocumentReaderService,
    OtherEmbedding,
    OpenAiEmbbedingService,
  ],
  exports: [
    XenovaEmbeddings,
    DocumentReaderService,
    OtherEmbedding,
    OpenAiEmbbedingService,
  ],
})
export class EmbeddingModule {}
