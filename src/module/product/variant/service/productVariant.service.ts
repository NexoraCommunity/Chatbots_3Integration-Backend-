import { HttpException, Injectable } from '@nestjs/common';
import { ProductVariant } from '@prisma/client';
import {
  ChangeProductVariant,
  ProductVariantApi,
} from 'src/model/variant.model';
import { PrismaService } from 'src/module/common/prisma.service';
import { ValidationService } from 'src/module/common/validation.service';
import { VariantValidation } from '../dto/variant.validation';

@Injectable()
export class ProductVariantService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  cartesian(arr) {
    return arr.reduce(
      (a, b) => a.flatMap((x) => b.map((y) => [...x, y])),
      [[]],
    );
  }

  async generateProductVariant(req): Promise<ProductVariant[]> {
    const variantOptions = await this.prismaService.variantOption.findMany({
      where: {
        productId: req.productId,
      },
      include: {
        values: true,
        product: true,
      },
    });

    if (variantOptions.length === 0) return [];

    const valuesPerOption = variantOptions.map((opt) => opt.values);
    const combinations = this.cartesian(valuesPerOption);
    const createdVariants = await Promise.all(
      combinations.map(async (combo, index) => {
        const pv = await this.prismaService.productVariant.create({
          data: {
            productId: req.productId,
            sku: '',
            stock: 0,
            price: 0,
          },
        });

        await this.prismaService.productVariantValue.createMany({
          data: combo.map((value) => ({
            variantId: pv.id,
            valueId: value.id,
          })),
        });

        return pv;
      }),
    );

    return createdVariants;
  }

  async editProductVariant(req: ChangeProductVariant) {
    try {
      const ProductValid: ChangeProductVariant =
        this.validationService.validate(
          VariantValidation.changeProductVariant,
          req,
        );

      if (!ProductValid) throw new HttpException('Validation Error', 400);
      const data = await this.prismaService.productVariant.update({
        where: {
          id: req.id,
        },
        data: ProductValid,
      });

      return data;
    } catch (error) {
      if (String(error).includes('invalid_type')) throw error;
      throw new HttpException('ProductId is Invalid', 400);
    }
  }
  async deleteProductVariant(id: string) {
    if (!id) throw new HttpException('Validation Error', 400);

    try {
      await this.prismaService.productVariant.delete({
        where: {
          id: id,
        },
      });
      return true;
    } catch (error) {
      throw new HttpException('ProductId is Invalid', 400);
    }
  }
}
