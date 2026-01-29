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
import { FeatureApi, ChangeFeature } from 'src/model/feature.model';
import { WebResponse } from 'src/model/web.model';
import { Feature } from '@prisma/client';
import { FeatureService } from './service/feature.service';

@Controller('api')
export class FeatureController {
  constructor(private featureService: FeatureService) {}
  @Post('/admin/feature')
  @HttpCode(200)
  async addNewFeature(
    @Body() body: FeatureApi,
  ): Promise<WebResponse<FeatureApi>> {
    const data = await this.featureService.addNewFeature(body);
    return {
      data: data,
      message: 'Feature created succesfully!!',
      status: '200',
    };
  }

  @Get('/admin/feature')
  @HttpCode(200)
  async getFeature(): Promise<WebResponse<Feature[]>> {
    const data = await this.featureService.getAllFeature();
    return {
      data: data,
      status: '200',
    };
  }
  @Get('/admin/feature/:id')
  @HttpCode(200)
  async getFeaturebyid(@Param('id') id: string): Promise<WebResponse<Feature>> {
    const data = await this.featureService.getFeaturebyId(Number(id));
    return {
      data: data,
      status: '200',
    };
  }

  @Patch('/admin/feature/:id')
  @HttpCode(200)
  async editFeature(
    @Body() body: ChangeFeature,
    @Param('id') id: string,
  ): Promise<WebResponse<FeatureApi>> {
    const data = await this.featureService.editFeature({
      ...body,
      id: Number(id),
    });
    return {
      data: data,
      message: 'Feature updated succesfully!!',
      status: '200',
    };
  }
  @Delete('/admin/feature/:id')
  @HttpCode(200)
  async deleteFeature(
    @Param('id') id: string,
  ): Promise<WebResponse<FeatureApi>> {
    await this.featureService.deleteFeature(Number(id));
    return {
      message: 'Feature deleted succesfully!!',
      status: '200',
    };
  }
}
