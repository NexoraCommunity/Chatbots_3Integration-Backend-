import { HttpException, Injectable } from '@nestjs/common';
import { VariantOption } from '@prisma/client';
import { PrismaService } from 'src/module/prisma/service/prisma.service';
import { ValidationService } from 'src/module/common/other/validation.service';
import { VariantOptionApi } from 'src/model/variant.model';
import { VariantValidation } from '../dto/variant.validation';

@Injectable()
export class VariantOptionService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getVariantOptionByProductId(query): Promise<VariantOption[]> {
    if (!query.productId) throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.variantOption.findMany({
      where: {
        productId: query.productId,
      },
    });

    return data;
  }
  async getVariantOptionbyId(id: string): Promise<VariantOption> {
    try {
      if (!id) throw new HttpException('Validation Error', 400);

      const data = await this.prismaService.variantOption.findFirst({
        where: {
          id: id,
        },
      });

      if (!data) throw new HttpException('Cannot Find VariantOption', 403);

      return data;
    } catch (error) {
      throw new HttpException('VariantOptionId is Invalid', 400);
    }
  }

  async addNewVariantOption(req: VariantOptionApi): Promise<VariantOptionApi> {
    const VariantOptionValid: VariantOptionApi =
      this.validationService.validate(VariantValidation.VariantOption, req);

    if (!VariantOptionValid) throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.variantOption.create({
      data: VariantOptionValid,
    });

    const res: VariantOptionApi = data;

    return res;
  }

  async deleteVariantOption(id: string) {
    if (!id) throw new HttpException('Validation Error', 400);

    try {
      const data = await this.prismaService.variantOption.delete({
        where: {
          id: id,
        },
      });
      return true;
    } catch (error) {
      throw new HttpException('VariantOptionId is Invalid', 400);
    }
  }
}
