import { Module } from '@nestjs/common';
import { VariantController } from './variant.controller';
import { VariantOptionService } from './service/variantOption.service';
import { ProductVariantService } from './service/productVariant.service';
import { VariantValueService } from './service/variantValue.service';

@Module({
  imports: [],
  controllers: [VariantController],
  providers: [VariantOptionService, ProductVariantService, VariantValueService],
})
export class VariantModule {}
