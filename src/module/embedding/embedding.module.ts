import { Global, Module } from '@nestjs/common';
import { XenovaEmbeddings } from './service/xenovaEmbbeding.service';
import { DocumentReaderService } from './service/documentReader.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [XenovaEmbeddings, DocumentReaderService],
  exports: [XenovaEmbeddings, DocumentReaderService],
})
export class EmbeddingModule {}
