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
  PostUserIntegration,
  UserIntegrationApi,
  ChangeUserIntegration,
} from 'src/model/userIntegrations.model';
import { WebResponse } from 'src/model/web.model';
import { UserIntegration } from '@prisma/client';
import { UserIntegrationService } from './service/userIntegration.service';

@Controller('api')
export class UserIntegrationController {
  constructor(private userIntegrationService: UserIntegrationService) {}
  @Post('userIntegration')
  @HttpCode(200)
  async addNewUserIntegration(
    @Body() body: PostUserIntegration,
  ): Promise<WebResponse<UserIntegrationApi>> {
    const data = await this.userIntegrationService.addNewUserIntegration(body);
    return {
      data: data,
      message: 'UserIntegration created succesfully!!',
      status: '200',
    };
  }

  @Get('userIntegration')
  @HttpCode(200)
  async getUserIntegration(
    @Query() query: UserIntegrationApi,
  ): Promise<WebResponse<UserIntegration[]>> {
    const data =
      await this.userIntegrationService.getUserIntegrationByUserId(query);
    return {
      data: data,
      status: '200',
    };
  }
  @Get('userIntegration/:id')
  @HttpCode(200)
  async getUserIntegrationbyid(
    @Param('id') id: string,
  ): Promise<WebResponse<UserIntegration>> {
    const data = await this.userIntegrationService.getUserIntegrationbyId(id);
    return {
      data: data,
      status: '200',
    };
  }

  @Patch('/admin/userIntegration/:id')
  @HttpCode(200)
  async editUserIntegration(
    @Body() body: ChangeUserIntegration,
    @Param('id') id: string,
  ): Promise<WebResponse<UserIntegrationApi>> {
    const data = await this.userIntegrationService.editUserIntegration({
      ...body,
      id: id,
    });
    return {
      data: data,
      message: 'UserIntegration updated succesfully!!',
      status: '200',
    };
  }
  @Delete('/admin/userIntegration/:id')
  @HttpCode(200)
  async deleteUserIntegration(
    @Param('id') id: string,
  ): Promise<WebResponse<UserIntegrationApi>> {
    await this.userIntegrationService.deleteUserIntegration(id);
    return {
      message: 'UserIntegration deleted succesfully!!',
      status: '200',
    };
  }
}
