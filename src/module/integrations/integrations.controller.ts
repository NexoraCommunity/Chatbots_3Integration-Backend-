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

@Controller('/auth')
export class IntegrationsController {
  constructor(private wabaService: WabaService) {}

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
}

// $env:Path += ";C:\Program Files (x86)\cloudflared"
//  cloudflared --version
// cloudflared tunnel --url http://localhost:8080
