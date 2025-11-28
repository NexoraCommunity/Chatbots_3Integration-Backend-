import { Module } from '@nestjs/common';
import { VariantController } from './variant.controller';
import { VariantService } from './service/variant.service';

@Module({
  imports: [],
  controllers: [VariantController],
  providers: [VariantService],
})
export class VariantModule {}
