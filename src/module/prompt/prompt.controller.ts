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
import { PromptService } from './service/prompt.service';
import { GetModelPrompt, postPrompt, PromptApi } from 'src/model/prompt.model';
import { WebResponse } from 'src/model/web.model';
import { Prompt } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { tempFileMulterConfig } from '../../interceptors/multer.interceptors';

@Controller('api')
export class PromptController {
  constructor(private promptService: PromptService) {}
  @Post('prompts')
  @UseInterceptors(FileInterceptor('image', tempFileMulterConfig))
  @HttpCode(200)
  async addNewPrompt(
    @Body() body: postPrompt,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponse<PromptApi>> {
    const data = await this.promptService.addNewPrompt({
      ...body,
      filePath: `/uploads/file/${file}`,
    });
    return {
      data: data,
      message: 'Prompt created succesfully!!',
      status: '200',
    };
  }

  @Get('prompts')
  @HttpCode(200)
  async getPrompt(
    @Query() query: GetModelPrompt,
  ): Promise<WebResponse<Prompt[]>> {
    const data = await this.promptService.getPromptByUserId(query);
    return {
      data: data.Prompt,
      pagination: data.Pagination,
      status: '200',
    };
  }
  @Get('/admin/prompts')
  @HttpCode(200)
  async getPromptAdmin(
    @Query() query: GetModelPrompt,
  ): Promise<WebResponse<Prompt[]>> {
    const data = await this.promptService.getPrompt(query);
    return {
      data: data.Prompt,
      pagination: data.Pagination,
      status: '200',
    };
  }
  @Get('prompts/:id')
  @HttpCode(200)
  async getPromptbyid(@Param('id') id: string): Promise<WebResponse<Prompt>> {
    const data = await this.promptService.getPromptbyId(id);
    return {
      data: data,
      status: '200',
    };
  }

  @Patch('prompts/:id')
  @UseInterceptors(FileInterceptor('image', tempFileMulterConfig))
  @HttpCode(200)
  async editPrompt(
    @Body() body: PromptApi,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponse<PromptApi>> {
    const data = await this.promptService.editPrompt({
      ...body,
      id: id,
      filePath: `/uploads/file/${file}`,
    });
    return {
      data: data,
      message: 'Prompt updated succesfully!!',
      status: '200',
    };
  }
  @Delete('prompts/:id')
  @HttpCode(200)
  async deletePrompt(@Param('id') id: string): Promise<WebResponse<PromptApi>> {
    await this.promptService.deletePrompt(id);
    return {
      message: 'Prompt deleted succesfully!!',
      status: '200',
    };
  }
}
