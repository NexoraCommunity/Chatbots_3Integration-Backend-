import { HttpException, Injectable } from '@nestjs/common';
import { ContentIntegration, Prisma } from '@prisma/client';
import {
  ChangeContentIntegration,
  ContentIntegrationApi,
  ContentIntegrationConfig,
  PostContentIntegration,
  toPrismaJson,
} from 'src/model/contentIntegrations.model';
import { PrismaService } from 'src/module/common/prisma.service';
import { ValidationService } from 'src/module/common/validation.service';
import { ContentIntegrationValidation } from '../dto/contentIntegration.validation';

@Injectable()
export class ContentIntegrationService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getContentIntegrationByuserIntegrationId(
    query,
  ): Promise<ContentIntegration[]> {
    if (!query.userIntegrationId)
      throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.contentIntegration.findMany({
      where: {
        userIntegrationId: query.userIntegrationId,
      },
    });
    return data;
  }

  async getContentIntegrationbyId(id: string): Promise<ContentIntegration> {
    try {
      if (!id) throw new HttpException('Validation Error', 400);

      const data = await this.prismaService.contentIntegration.findFirst({
        where: {
          id: id,
        },
      });

      if (!data) throw new HttpException('Cannot Find ContentIntegration', 403);

      return data;
    } catch (error) {
      throw new HttpException('ContentIntegrationId is Invalid', 400);
    }
  }

  async addNewContentIntegration(
    req: PostContentIntegration<ContentIntegrationConfig>,
  ): Promise<ContentIntegrationApi<Prisma.JsonValue>> {
    const ContentIntegrationValid: PostContentIntegration<ContentIntegrationConfig> =
      this.validationService.validate(
        ContentIntegrationValidation.ContentIntegration,
        req,
      );

    if (!ContentIntegrationValid)
      throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.contentIntegration.create({
      data: {
        ...ContentIntegrationValid,
        configJson: toPrismaJson(ContentIntegrationValid.configJson),
      },
    });

    const result: ContentIntegrationApi<Prisma.JsonValue> = await data;

    return result;
  }

  async editContentIntegration(
    req: ChangeContentIntegration<ContentIntegrationConfig>,
  ) {
    try {
      const ContentIntegrationValid: ChangeContentIntegration<ContentIntegrationConfig> =
        this.validationService.validate(
          ContentIntegrationValidation.ChangeContentIntegration,
          req,
        );

      if (!ContentIntegrationValid)
        throw new HttpException('Validation Error', 400);
      const data = await this.prismaService.contentIntegration.update({
        where: {
          id: req.id,
        },
        data: {
          ...ContentIntegrationValid,
          configJson: toPrismaJson(ContentIntegrationValid.configJson),
        },
      });

      const result: ContentIntegrationApi<Prisma.JsonValue> = await data;
      return result;
    } catch (error) {
      if (String(error).includes('invalid_type')) throw error;
      throw new HttpException('ContentIntegrationId is Invalid', 400);
    }
  }
  async deleteContentIntegration(id: string) {
    if (!id) throw new HttpException('Validation Error', 400);

    try {
      const data = await this.prismaService.contentIntegration.delete({
        where: {
          id: id,
        },
      });
      return true;
    } catch (error) {
      throw new HttpException('ContentIntegrationId is Invalid', 400);
    }
  }
}
