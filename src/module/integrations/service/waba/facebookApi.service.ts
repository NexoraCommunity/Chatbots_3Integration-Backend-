import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PostMessage } from 'src/model/waba.model';

@Injectable()
export class FacebookApiService {
  constructor(private readonly configService: ConfigService) {}

  async getbussinesData(accessToken: string) {
    const bizRes = await axios.get(
      'https://graph.facebook.com/v21.0/me/businesses',
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!bizRes.data.data.length)
      throw new HttpException('No business found', 401);

    return bizRes.data.data[0];
  }

  async getWaBussinessAccount(accessToken: string, businessId: string) {
    const wabaRes = await axios.get(
      `https://graph.facebook.com/v21.0/${businessId}/owned_whatsapp_business_accounts`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const wabas = wabaRes.data.data;
    if (!wabas.length)
      throw new HttpException('No whatsaap bussiness account found', 401);
    return wabas[0];
  }

  async getNumberPhoneID(accessToken: string, wabaId: string) {
    const phoneRes = await axios.get(
      `https://graph.facebook.com/v21.0/${wabaId}/phone_numbers`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    return phoneRes.data.data || [];
  }

  async PostMessage(req: PostMessage) {
    const accessToken = req.accessToken;
    try {
      const body = {
        messaging_product: 'whatsapp',
        to: req.to,
        type: req.type,
        text: {
          preview_url: true,
          body: req.message,
        },
      };

      await axios.post(
        `https://graph.facebook.com/v22.0/${req.numberPhoneId}/messages`,
        body,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `application/json`,
          },
        },
      );

      return true;
    } catch (error) {
      return false;
    }
  }
}
