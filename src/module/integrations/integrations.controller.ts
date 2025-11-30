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
  Res,
} from '@nestjs/common';

import type { Response } from 'express';
import { WabaService } from './service/waba/waba.service';
import { WebResponse } from 'src/model/web.model';
import { IntegrationApi } from 'src/model/integration.model';
import { Integration } from '@prisma/client';
import { Integrationservice } from './service/integration.service';

@Controller('/auth')
export class IntegrationsController {
  constructor(
    private wabaService: WabaService,
    private integrationService: Integrationservice,
  ) {}

  @Get('/waba/callback')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const VERIFY_TOKEN = 'MyFacebookTokenSecret';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verified!');
      return res.status(200).send(challenge);
    } else {
      console.log('❌ Verification failed.');
      return res.sendStatus(403);
    }
  }
  @Post('/waba/callback')
  CatchWebhook(@Res() res: Response, @Body() body: any) {
    if (body.object === 'whatsapp_business_account') {
      body.entry?.forEach((entry) => {
        const wabaId = entry.id;
        entry.changes?.forEach((change) => {
          const value = change.value;
          const numberPhoneId = value.metadata.phone_number_id;
          if (value?.messages) {
            const message = value.messages[0];
            const from = message.from;
            const text = message.text?.body;
            this.wabaService.sendMessage({ from, text, wabaId, numberPhoneId });
          }
        });
      });
    }

    return res.sendStatus(200);
  }

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
  async getbot(
    @Query() query: IntegrationApi,
  ): Promise<WebResponse<Integration[]>> {
    const data = await this.integrationService.getIntegration(query);
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
  @Delete('/admin/integrations/:id')
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

// $env:Path += ";C:\Program Files (x86)\cloudflared"
//  cloudflared --version
// cloudflared tunnel --url http://localhost:8080
