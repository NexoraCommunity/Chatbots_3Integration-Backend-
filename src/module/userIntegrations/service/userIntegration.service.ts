import { HttpException, Injectable } from '@nestjs/common';
import { UserIntegration } from '@prisma/client';
import { PrismaService } from 'src/module/common/prisma.service';
import { ValidationService } from 'src/module/common/validation.service';
import {
  ChangeUserIntegration,
  PostUserIntegration,
  UserIntegrationApi,
} from 'src/model/userIntegrations.model';
import { UserIntegrationValidation } from '../dto/userIntegration.validation';

@Injectable()
export class UserIntegrationService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getUserIntegrationByUserId(query): Promise<UserIntegration[]> {
    if (!query.userId) throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.userIntegration.findMany({
      where: {
        userId: query.userId,
      },
      include: {
        contentIntegrations: true,
      },
    });
    return data;
  }

  async getUserIntegrationbyId(id: string): Promise<UserIntegration> {
    try {
      if (!id) throw new HttpException('Validation Error', 400);

      const data = await this.prismaService.userIntegration.findFirst({
        where: {
          id: id,
        },
      });

      if (!data) throw new HttpException('Cannot Find UserIntegration', 403);

      return data;
    } catch (error) {
      throw new HttpException('UserIntegrationId is Invalid', 400);
    }
  }

  async addNewUserIntegration(
    req: PostUserIntegration,
  ): Promise<UserIntegrationApi> {
    const UserIntegrationValid: PostUserIntegration =
      this.validationService.validate(
        UserIntegrationValidation.UserIntegration,
        req,
      );

    if (!UserIntegrationValid) throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.userIntegration.create({
      data: {
        ...UserIntegrationValid,
        connectedAt: new Date(),
      },
    });

    const res: UserIntegrationApi = data;
    return res;
  }

  async editUserIntegration(req: ChangeUserIntegration) {
    try {
      const UserIntegrationValid: ChangeUserIntegration =
        this.validationService.validate(
          UserIntegrationValidation.ChangeUserIntegration,
          req,
        );

      if (!UserIntegrationValid)
        throw new HttpException('Validation Error', 400);
      const data = await this.prismaService.userIntegration.update({
        where: {
          id: req.id,
        },
        data: UserIntegrationValid,
      });

      const res: UserIntegrationApi = data;
      return res;
    } catch (error) {
      if (String(error).includes('invalid_type')) throw error;
      throw new HttpException('UserIntegrationId is Invalid', 400);
    }
  }
  async deleteUserIntegration(id: string) {
    if (!id) throw new HttpException('Validation Error', 400);

    try {
      const data = await this.prismaService.userIntegration.delete({
        where: {
          id: id,
        },
      });
      return true;
    } catch (error) {
      throw new HttpException('UserIntegrationId is Invalid', 400);
    }
  }
}
