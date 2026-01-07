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
import { UserAgentService } from './service/userAgent.service';
import {
  GetModelUserAgent,
  postUserAgent,
  UserAgentApi,
  changeUserAgent,
  UserAgentResponseById,
} from 'src/model/userAgent.model';
import { WebResponse } from 'src/model/web.model';
import { UserAgent } from '@prisma/client';

@Controller('api')
export class UserAgentController {
  constructor(private agentService: UserAgentService) {}
  @Post('userAgent')
  @HttpCode(200)
  async addNewAgent(
    @Body() body: postUserAgent,
  ): Promise<WebResponse<UserAgentApi>> {
    const data = await this.agentService.addNewUserAgent(body);
    return {
      data: data,
      message: 'Agent created succesfully!!',
      status: '200',
    };
  }

  @Get('userAgent')
  @HttpCode(200)
  async getAgent(
    @Query() query: GetModelUserAgent,
  ): Promise<WebResponse<UserAgent[]>> {
    const data = await this.agentService.getUserAgentByUserId(query);
    return {
      data: data.UserAgent,
      pagination: data.Pagination,
      status: '200',
    };
  }
  @Get('/admin/userAgent')
  @HttpCode(200)
  async getAgentAdmin(
    @Query() query: GetModelUserAgent,
  ): Promise<WebResponse<UserAgent[]>> {
    const data = await this.agentService.getUserAgent(query);
    return {
      data: data.UserAgent,
      pagination: data.Pagination,
      status: '200',
    };
  }
  @Get('userAgent/:id')
  @HttpCode(200)
  async getAgentbyid(
    @Param('id') id: string,
  ): Promise<WebResponse<UserAgentResponseById>> {
    const data = await this.agentService.getUserAgentbyId(id);
    return {
      data: data,
      status: '200',
    };
  }

  @Patch('userAgent/:id')
  @HttpCode(200)
  async editAgent(
    @Body() body: changeUserAgent,
    @Param('id') id: string,
  ): Promise<WebResponse<UserAgentApi>> {
    const data = await this.agentService.editUserAgent({
      ...body,
      id: id,
    });
    return {
      data: data,
      message: 'Agent updated succesfully!!',
      status: '200',
    };
  }
  @Delete('userAgent/:id')
  @HttpCode(200)
  async deleteAgent(
    @Param('id') id: string,
  ): Promise<WebResponse<UserAgentApi>> {
    await this.agentService.deleteUserAgent(id);
    return {
      message: 'Agent deleted succesfully!!',
      status: '200',
    };
  }
}
