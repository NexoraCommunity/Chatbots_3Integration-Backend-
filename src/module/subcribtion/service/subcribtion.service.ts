import { HttpException, Injectable } from '@nestjs/common';
import { Subscribtion } from '@prisma/client';
import { PrismaService } from 'src/module/prisma/service/prisma.service';
import { ValidationService } from 'src/module/common/other/validation.service';
import { ChangeSubcribtion, SubcribtionApi } from 'src/model/subcribtion.model';
import { SubcribtionValidation } from '../dto/subcribtion.validation';

@Injectable()
export class SubscribtionService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getAllSubscribtion(): Promise<Subscribtion[]> {
    const data = await this.prismaService.subscribtion.findMany();
    return data;
  }

  async getSubscribtionbyId(id: number): Promise<Subscribtion> {
    try {
      if (!id) throw new HttpException('Validation Error', 400);

      const data = await this.prismaService.subscribtion.findFirst({
        where: {
          id: id,
        },
      });

      if (!data) throw new HttpException('Cannot Find Subscribtion', 403);

      return data;
    } catch (error) {
      throw new HttpException('SubscribtionId is Invalid', 400);
    }
  }

  async addNewSubscribtion(req: SubcribtionApi): Promise<SubcribtionApi> {
    const SubscribtionValid: SubcribtionApi = this.validationService.validate(
      SubcribtionValidation.Subcribtion,
      req,
    );

    if (!SubscribtionValid) throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.subscribtion.create({
      data: SubscribtionValid,
    });

    const res: SubcribtionApi = data;
    return res;
  }

  async editSubscribtion(req: ChangeSubcribtion) {
    try {
      const SubscribtionValid: ChangeSubcribtion =
        this.validationService.validate(
          SubcribtionValidation.changeSubcribtion,
          req,
        );

      if (!SubscribtionValid) throw new HttpException('Validation Error', 400);
      const data = await this.prismaService.subscribtion.update({
        where: {
          id: req.id,
        },
        data: SubscribtionValid,
      });

      const res: SubcribtionApi = data;
      return res;
    } catch (error) {
      if (String(error).includes('invalid_type')) throw error;
      throw new HttpException('SubscribtionId is Invalid', 400);
    }
  }
  async deleteSubscribtion(id: number) {
    if (!id) throw new HttpException('Validation Error', 400);

    try {
      const data = await this.prismaService.subscribtion.delete({
        where: {
          id: id,
        },
      });
      return true;
    } catch (error) {
      throw new HttpException('SubscribtionId is Invalid', 400);
    }
  }
}
