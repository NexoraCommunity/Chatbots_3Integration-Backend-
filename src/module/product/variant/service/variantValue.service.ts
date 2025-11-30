import { HttpException, Injectable } from '@nestjs/common';
import { VariantValue } from '@prisma/client';
import { PrismaService } from 'src/module/common/prisma.service';
import { ValidationService } from 'src/module/common/validation.service';
import { VariantValueApi } from 'src/model/variant.model';
import { VariantValidation } from '../dto/variant.validation';

@Injectable()
export class VariantValueService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getVariantValueByVariantOptionId(query): Promise<VariantValue[]> {
    if (!query.Id) throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.variantValue.findMany({
      where: {
        optionId: query.optionId,
      },
    });

    return data;
  }
  async getVariantValuebyId(id: string): Promise<VariantValue> {
    try {
      if (!id) throw new HttpException('Validation Error', 400);

      const data = await this.prismaService.variantValue.findFirst({
        where: {
          id: id,
        },
      });

      if (!data) throw new HttpException('Cannot Find VariantValue', 403);

      return data;
    } catch (error) {
      throw new HttpException('VariantValueId is Invalid', 400);
    }
  }

  async addNewVariantValue(req: VariantValueApi): Promise<VariantValueApi> {
    const VariantValueValid: VariantValueApi = this.validationService.validate(
      VariantValidation.VariantValue,
      req,
    );

    if (!VariantValueValid) throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.variantValue.create({
      data: VariantValueValid,
    });

    const res: VariantValueApi = data;

    return res;
  }

  async deleteVariantValue(id: string) {
    if (!id) throw new HttpException('Validation Error', 400);

    try {
      const data = await this.prismaService.variantValue.delete({
        where: {
          id: id,
        },
      });
      return true;
    } catch (error) {
      throw new HttpException('VariantValueId is Invalid', 400);
    }
  }
}
