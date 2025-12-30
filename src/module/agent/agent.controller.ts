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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AgentService } from './service/agent.service';
import {
  GetModelAgent,
  postAgent,
  AgentApi,
  changeAgent,
} from 'src/model/agent.model';
import { WebResponse } from 'src/model/web.model';
import { Agent } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { tempFileMulterConfig } from '../../interceptors/multer.interceptors';
import path from 'path';

@Controller('api')
export class AgentController {
  constructor(private agentService: AgentService) {}
  @Post('agent')
  @UseInterceptors(FileInterceptor('file', tempFileMulterConfig))
  @HttpCode(200)
  async addNewAgent(
    @Body() body: postAgent,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<WebResponse<AgentApi>> {
    const filename = file?.filename ?? null;

    const filePath = filename ? path.join('uploads', 'file', filename) : null;
    const data = await this.agentService.addNewAgent(
      {
        ...body,
        filePath: filePath ? filePath : '',
      },
      filename,
    );
    return {
      data: data,
      message: 'Agent created succesfully!!',
      status: '200',
    };
  }

  @Get('agent')
  @HttpCode(200)
  async getAgent(@Query() query: GetModelAgent): Promise<WebResponse<Agent[]>> {
    const data = await this.agentService.getAgentByUserId(query);
    return {
      data: data.Agent,
      pagination: data.Pagination,
      status: '200',
    };
  }
  @Get('/admin/agent')
  @HttpCode(200)
  async getAgentAdmin(
    @Query() query: GetModelAgent,
  ): Promise<WebResponse<Agent[]>> {
    const data = await this.agentService.getAgent(query);
    return {
      data: data.Agent,
      pagination: data.Pagination,
      status: '200',
    };
  }
  @Get('agent/:id')
  @HttpCode(200)
  async getAgentbyid(@Param('id') id: string): Promise<WebResponse<Agent>> {
    const data = await this.agentService.getAgentbyId(id);
    return {
      data: data,
      status: '200',
    };
  }

  @Patch('agent/:id')
  @UseInterceptors(FileInterceptor('file', tempFileMulterConfig))
  @HttpCode(200)
  async editAgent(
    @Body() body: changeAgent,
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<WebResponse<AgentApi>> {
    const filename = file?.filename ?? null;
    const data = await this.agentService.editAgent(
      {
        ...body,
        id: id,
      },
      filename,
    );
    return {
      data: data,
      message: 'Agent updated succesfully!!',
      status: '200',
    };
  }
  @Delete('agent/:id')
  @HttpCode(200)
  async deleteAgent(@Param('id') id: string): Promise<WebResponse<AgentApi>> {
    await this.agentService.deleteAgent(id);
    return {
      message: 'Agent deleted succesfully!!',
      status: '200',
    };
  }
}
