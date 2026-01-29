import { Global, Module } from '@nestjs/common';
import { VectorStoreService } from './service/vectoreStore.service';
import { SupabaseStoreService } from './service/supabaseStore.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [VectorStoreService, SupabaseStoreService],
  exports: [VectorStoreService, SupabaseStoreService],
})
export class VectorModule {}
