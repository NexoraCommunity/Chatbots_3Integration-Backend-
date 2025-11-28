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
import { ConversationService } from './service/conversation.service';
import {
  GetModelConversation,
  PostConversation,
  ConversationApi,
  ChangeConversation,
} from 'src/model/conversation.model';
import { WebResponse } from 'src/model/web.model';
import { Conversation } from '@prisma/client';

@Controller('api')
export class ConversationController {
  constructor(private ConversationService: ConversationService) {}
  @Post('conversation')
  @HttpCode(200)
  async addNewConversation(
    @Body() body: PostConversation,
  ): Promise<WebResponse<ConversationApi>> {
    const data = await this.ConversationService.addNewConversation(body);
    return {
      data: data,
      message: 'Conversation created succesfully!!',
      status: '200',
    };
  }

  @Get('conversation')
  @HttpCode(200)
  async getConversation(
    @Query() query: GetModelConversation,
  ): Promise<WebResponse<Conversation[]>> {
    const data =
      await this.ConversationService.getConversationByConversationId(query);
    return {
      data: data.Conversation,
      pagination: data.Pagination,
      status: '200',
    };
  }
  @Get('/admin/conversation')
  @HttpCode(200)
  async getConversationAdmin(
    @Query() query: GetModelConversation,
  ): Promise<WebResponse<Conversation[]>> {
    const data = await this.ConversationService.getConversation(query);
    return {
      data: data.Conversation,
      pagination: data.Pagination,
      status: '200',
    };
  }
  @Get('conversation/:id')
  @HttpCode(200)
  async getConversationbyid(
    @Param('id') id: string,
  ): Promise<WebResponse<Conversation>> {
    const data = await this.ConversationService.getConversationbyId(id);
    return {
      data: data,
      status: '200',
    };
  }

  @Patch('conversation/:id')
  @HttpCode(200)
  async editConversation(
    @Body() body: ChangeConversation,
    @Param('id') id: string,
  ): Promise<WebResponse<ConversationApi>> {
    const data = await this.ConversationService.editConversation({
      ...body,
      id: id,
    });
    return {
      data: data,
      message: 'Conversation updated succesfully!!',
      status: '200',
    };
  }
  @Delete('conversation/:id')
  @HttpCode(200)
  async deleteConversation(
    @Param('id') id: string,
  ): Promise<WebResponse<ConversationApi>> {
    await this.ConversationService.deleteConversation(id);
    return {
      message: 'Conversation deleted succesfully!!',
      status: '200',
    };
  }
}
