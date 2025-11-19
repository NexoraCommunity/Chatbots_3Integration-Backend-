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
import { MessageService } from './service/message.service';
import {
  GetModelMessage,
  PostMessage,
  MessageApi,
  ChangeMessage,
} from 'src/model/message.model';
import { WebResponse } from 'src/model/web.model';
import { Message } from '@prisma/client';

@Controller('api')
export class MessageController {
  constructor(private MessageService: MessageService) {}
  @Post('Message')
  @HttpCode(200)
  async addNewMessage(
    @Body() body: PostMessage,
  ): Promise<WebResponse<MessageApi>> {
    const data = await this.MessageService.addNewMessage(body);
    return {
      data: data,
      message: 'Message created succesfully!!',
      status: '200',
    };
  }

  @Get('Message')
  @HttpCode(200)
  async getMessage(
    @Query() query: GetModelMessage,
  ): Promise<WebResponse<Message[]>> {
    const data = await this.MessageService.getMessageByConversationId(query);
    return {
      data: data.message,
      pagination: data.Pagination,
      status: '200',
    };
  }
  @Get('/admin/Message')
  @HttpCode(200)
  async getMessageAdmin(
    @Query() query: GetModelMessage,
  ): Promise<WebResponse<Message[]>> {
    const data = await this.MessageService.getMessage(query);
    return {
      data: data.message,
      pagination: data.Pagination,
      status: '200',
    };
  }
  @Get('Message/:id')
  @HttpCode(200)
  async getMessagebyid(@Param('id') id: string): Promise<WebResponse<Message>> {
    const data = await this.MessageService.getMessagebyId(id);
    return {
      data: data,
      status: '200',
    };
  }

  @Patch('Message/:id')
  @HttpCode(200)
  async editMessage(
    @Body() body: ChangeMessage,
    @Param('id') id: string,
  ): Promise<WebResponse<MessageApi>> {
    const data = await this.MessageService.editMessage({ ...body, id: id });
    return {
      data: data,
      message: 'Message updated succesfully!!',
      status: '200',
    };
  }
  @Delete('Message/:id')
  @HttpCode(200)
  async deleteMessage(
    @Param('id') id: string,
  ): Promise<WebResponse<MessageApi>> {
    await this.MessageService.deleteMessage(id);
    return {
      message: 'Message deleted succesfully!!',
      status: '200',
    };
  }
}
