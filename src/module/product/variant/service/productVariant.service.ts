import { Injectable } from '@nestjs/common';
import { ProductVariant } from '@prisma/client';
import { ProductVariantApi } from 'src/model/variant.model';
import { PrismaService } from 'src/module/common/prisma.service';
import { ValidationService } from 'src/module/common/validation.service';

@Injectable()
export class ProductVariantService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  // async generateProductVariant(
  //   req: ProductVariantApi,
  // ): Promise<ProductVariant[]> {

  //   return
  // }
}
