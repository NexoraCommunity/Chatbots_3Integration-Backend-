import { Controller, Injectable } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { WebResponse } from 'src/model/web.model';
import { IntegrationApi } from 'src/model/integration.model';
import { Integration } from '@prisma/client';
import { Integrationservice } from './service/integration.service';

@Controller('api')
export class IntegrationApisController {
  constructor(private integrationService: Integrationservice) {}
  @Post('/admin/integration')
  @HttpCode(200)
  async addNewbot(
    @Body() body: IntegrationApi,
  ): Promise<WebResponse<IntegrationApi>> {
    const data = await this.integrationService.addNewIntegration(body);
    return {
      data: data,
      message: 'Integration created succesfully!!',
      status: '200',
    };
  }

  @Get('integration')
  @HttpCode(200)
  async getbot(): Promise<WebResponse<Integration[]>> {
    const data = await this.integrationService.getIntegration();
    return {
      data: data,
      status: '200',
    };
  }

  @Get('integration/:id')
  @HttpCode(200)
  async getbotbyid(@Param('id') id: string): Promise<WebResponse<Integration>> {
    const data = await this.integrationService.getIntegrationbyId(id);
    return {
      data: data,
      status: '200',
    };
  }

  @Patch('/admin/integration/:id')
  @HttpCode(200)
  async editbot(
    @Body() body: IntegrationApi,
    @Param('id') id: string,
  ): Promise<WebResponse<IntegrationApi>> {
    const data = await this.integrationService.editIntegration({
      ...body,
      id: id,
    });
    return {
      data: data,
      message: 'Integration updated succesfully!!',
      status: '200',
    };
  }
  @Delete('/admin/integration/:id')
  @HttpCode(200)
  async deletebot(
    @Param('id') id: string,
  ): Promise<WebResponse<IntegrationApi>> {
    await this.integrationService.deleteIntegration(id);
    return {
      message: 'Integration deleted succesfully!!',
      status: '200',
    };
  }
}
