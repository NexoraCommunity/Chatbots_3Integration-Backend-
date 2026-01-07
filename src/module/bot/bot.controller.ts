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
import { WebResponse } from 'src/model/web.model';
import { BotApi, changeBot, GetModelbot, postBot } from 'src/model/bot.model';
import { Bot } from '@prisma/client';
import { BotService } from './service/bot.service';
@Controller('api')
export class BotController {
  constructor(private botService: BotService) {}

  @Post('bot')
  @HttpCode(200)
  async addNewbot(@Body() body: postBot): Promise<WebResponse<BotApi>> {
    const data = await this.botService.addNewBot(body);
    return {
      data: data,
      message: 'bot created succesfully!!',
      status: '200',
    };
  }

  @Get('bot')
  @HttpCode(200)
  async getbot(@Query() query: GetModelbot): Promise<WebResponse<Bot[]>> {
    const data = await this.botService.getBotByUserId(query);
    return {
      data: data.bot,
      pagination: data.Pagination,
      status: '200',
    };
  }
  @Get('/admin/bot')
  @HttpCode(200)
  async getbotAdmin(@Query() query: GetModelbot): Promise<WebResponse<Bot[]>> {
    const data = await this.botService.getBot(query);
    return {
      data: data.bot,
      pagination: data.Pagination,
      status: '200',
    };
  }
  @Get('bot/:id')
  @HttpCode(200)
  async getbotbyid(@Param('id') id: string): Promise<WebResponse<Bot>> {
    const data = await this.botService.getBotbyId(id);
    return {
      data: data,
      status: '200',
    };
  }

  @Patch('bot/:id')
  @HttpCode(200)
  async editbot(
    @Body() body: changeBot,
    @Param('id') id: string,
  ): Promise<WebResponse<BotApi>> {
    const data = await this.botService.editBot({ ...body, id: id });
    return {
      data: data,
      message: 'bot updated succesfully!!',
      status: '200',
    };
  }
  @Delete('bot/:id')
  @HttpCode(200)
  async deletebot(@Param('id') id: string): Promise<WebResponse<BotApi>> {
    await this.botService.deleteBot(id);
    return {
      message: 'bot deleted succesfully!!',
      status: '200',
    };
  }
}
