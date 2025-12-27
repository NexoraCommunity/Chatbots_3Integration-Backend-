import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  PostContentIntegration,
  ContentIntegrationApi,
  ChangeContentIntegration,
  ContentIntegrationConfig,
} from 'src/model/contentIntegrations.model';
import { WebResponse } from 'src/model/web.model';
import { ContentIntegration, Prisma } from '@prisma/client';
import { ContentIntegrationService } from './service/contentIntegration.service';

@Controller('api')
export class ContentIntegrationController {
  constructor(private contentIntegrationService: ContentIntegrationService) {}
  @Post('contentIntegration')
  @HttpCode(200)
  async addNewContentIntegration(
    @Body() body: PostContentIntegration<ContentIntegrationConfig>,
  ): Promise<WebResponse<ContentIntegrationApi<Prisma.JsonValue>>> {
    const data =
      await this.contentIntegrationService.addNewContentIntegration(body);
    return {
      data: data,
      message: 'ContentIntegration created succesfully!!',
      status: '200',
    };
  }

  @Get('contentIntegration')
  @HttpCode(200)
  async getContentIntegration(
    @Query() query: ContentIntegrationApi<Prisma.JsonValue>,
  ): Promise<WebResponse<ContentIntegration[]>> {
    const data =
      await this.contentIntegrationService.getContentIntegrationByuserIntegrationId(
        query,
      );
    return {
      data: data,
      status: '200',
    };
  }
  @Get('contentIntegration/:id')
  @HttpCode(200)
  async getContentIntegrationbyid(
    @Param('id') id: string,
  ): Promise<WebResponse<ContentIntegration>> {
    const data =
      await this.contentIntegrationService.getContentIntegrationbyId(id);
    return {
      data: data,
      status: '200',
    };
  }

  @Patch('/contentIntegration/:id')
  @HttpCode(200)
  async editContentIntegration(
    @Body() body: ChangeContentIntegration<ContentIntegrationConfig>,
    @Param('id') id: string,
  ): Promise<WebResponse<ContentIntegrationApi<Prisma.JsonValue>>> {
    const data = await this.contentIntegrationService.editContentIntegration({
      ...body,
      id: id,
    });
    return {
      data: data,
      message: 'ContentIntegration updated succesfully!!',
      status: '200',
    };
  }
  @Delete('/contentIntegration/:id')
  @HttpCode(200)
  async deleteContentIntegration(
    @Param('id') id: string,
  ): Promise<WebResponse<ContentIntegrationApi<Prisma.JsonValue>>> {
    await this.contentIntegrationService.deleteContentIntegration(id);
    return {
      message: 'ContentIntegration deleted succesfully!!',
      status: '200',
    };
  }
}
