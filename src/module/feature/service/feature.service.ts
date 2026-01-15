import { HttpException, Injectable } from '@nestjs/common';
import { Feature } from '@prisma/client';
import { PrismaService } from 'src/module/prisma/service/prisma.service';
import { ValidationService } from 'src/module/common/other/validation.service';
import { ChangeFeature, FeatureApi } from 'src/model/feature.model';
import { FeatureValidation } from '../dto/feature.validation';

@Injectable()
export class FeatureService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getAllFeature(): Promise<Feature[]> {
    const data = await this.prismaService.feature.findMany();
    return data;
  }

  async getFeaturebyId(id: number): Promise<Feature> {
    try {
      if (!id) throw new HttpException('Validation Error', 400);

      const data = await this.prismaService.feature.findFirst({
        where: {
          id: id,
        },
      });

      if (!data) throw new HttpException('Cannot Find Feature', 403);

      return data;
    } catch (error) {
      throw new HttpException('FeatureId is Invalid', 400);
    }
  }

  async addNewFeature(req: FeatureApi): Promise<FeatureApi> {
    const FeatureValid: FeatureApi = this.validationService.validate(
      FeatureValidation.Feature,
      req,
    );

    if (!FeatureValid) throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.feature.create({
      data: FeatureValid,
    });

    const res: FeatureApi = data;
    return res;
  }

  async editFeature(req: ChangeFeature) {
    try {
      const FeatureValid: ChangeFeature = this.validationService.validate(
        FeatureValidation.changeFeature,
        req,
      );

      if (!FeatureValid) throw new HttpException('Validation Error', 400);
      const data = await this.prismaService.feature.update({
        where: {
          id: req.id,
        },
        data: FeatureValid,
      });

      const res: FeatureApi = data;
      return res;
    } catch (error) {
      if (String(error).includes('invalid_type')) throw error;
      throw new HttpException('FeatureId is Invalid', 400);
    }
  }
  async deleteFeature(id: number) {
    if (!id) throw new HttpException('Validation Error', 400);

    try {
      const data = await this.prismaService.feature.delete({
        where: {
          id: id,
        },
      });
      return true;
    } catch (error) {
      throw new HttpException('FeatureId is Invalid', 400);
    }
  }
}
