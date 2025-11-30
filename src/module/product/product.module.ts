import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './service/product.service';
import { VariantModule } from './variant/variant.module';

@Module({
  imports: [VariantModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
