import { Global, Module } from '@nestjs/common';
import { VectorStoreService } from './service/vectoreStore.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [VectorStoreService],
  exports: [VectorStoreService],
})
export class VectorModule {}
