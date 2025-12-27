import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { HttpFilter } from 'src/filter/http.filter';
import { ValidationFilter } from 'src/filter/validation.filter';
import { TestModule } from '../test.module';
import { testService } from '../test.service';
import { JwtFilter } from 'src/filter/jwt.filter';
import cookieParser from 'cookie-parser';

describe('ContentIntegrationRouteTest', () => {
  let app: INestApplication<App>;
  let test: testService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());

    app.useGlobalFilters(new HttpFilter());
    app.useGlobalFilters(new ValidationFilter());
    app.useGlobalFilters(new JwtFilter());
    test = app.get(testService);

    await app.init();
  });

  describe('GET api/contentIntegration', () => {
    it('should be accepted if content authentication and request valid', async () => {
      const userIntegration = await test.getUserIntegration();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/contentIntegration?userIntegrationId=${userIntegration?.id}`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('get should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/contentIntegration',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('get should be rejected if request is invalid', async () => {
      const accessToken = await test.getAccessToken();

      const response = await request(app.getHttpServer())
        .get('/api/contentIntegration')
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    });
    it('get should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/contentIntegration')
        .set('Cookie', [`access_token=Invalid`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('get should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/contentIntegration')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('POST /api/contentIntegration', () => {
    it('should be posted if request is valid', async () => {
      const userIntegration = await test.getUserIntegration();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .post('/api/contentIntegration')
        .send({
          type: 'LLM',
          configJson: {
            apiKey: 'testapikey123',
            provider: 'groq',
            model: 'test',
          },
          userIntegrationId: userIntegration?.id,
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'ContentIntegration created succesfully!!',
      );
      expect(response.body.data.type).toBe('LLM');
      expect(response.body.data.configJson.apiKey).toBe('testapikey123');
      expect(response.body.data.configJson.provider).toBe('groq');
      expect(response.body.data.configJson.model).toBe('test');
    });
    it('should be posted if request is valid', async () => {
      const userIntegration = await test.getUserIntegration();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .post('/api/contentIntegration')
        .send({
          type: 'LLM',
          configJson: {
            accessToken: 'testapikey123',
            botName: 'test',
            provider: 'botFather',
          },
          userIntegrationId: userIntegration?.id,
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'ContentIntegration created succesfully!!',
      );
      expect(response.body.data.type).toBe('LLM');
      expect(response.body.data.configJson.accessToken).toBe('testapikey123');
      expect(response.body.data.configJson.provider).toBe('botFather');
      expect(response.body.data.configJson.botName).toBe('test');
    });
    it('should be rejected if request is invalid', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .post('/api/contentIntegration')
        .send({
          type: '',
          configJson: {},
          userIntegrationId: '',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    it('post should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contentIntegration')
        .send({
          type: '',
          configJson: {},
          userIntegrationId: '',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('post should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contentIntegration')
        .send({
          type: '',
          configJson: {},
          userIntegrationId: '',
        })
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('post should be rejected if accessToken is expired', async () => {
      const bot = await test.getBot();

      const response = await request(app.getHttpServer())
        .post('/api/contentIntegration')
        .send({
          type: '',
          configJson: {},
          userIntegrationId: '',
        })
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('GET /api/contentIntegration/:id', () => {
    it('should be accepted if content authentication', async () => {
      const contentIntegration = await test.getContentIntegration();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/contentIntegration/${String(contentIntegration?.id)}`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.data.type).toBe('LLM');
      expect(response.body.data.configJson.apiKey).toBe('testapikey123');
      expect(response.body.data.configJson.provider).toBe('groq');
      expect(response.body.data.configJson.model).toBe('test');
    });

    it('should be rejected if contentIntegrationId is invalid', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/contentIntegration/aokwokwowk`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('ContentIntegrationId is Invalid');
    });
  });

  describe('PATCH /api/contentIntegration/:id', () => {
    it('should be rejected if request is invalid', async () => {
      const contentIntegration = await test.getContentIntegration();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/contentIntegration/${contentIntegration?.id}`)
        .send({
          type: '',
          configJson: {},
          userIntegrationId: '',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    it('should be rejected if Id is not found', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/contentIntegration/1`)
        .send({
          type: '',
          configJson: {},
          userIntegrationId: '',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('ContentIntegrationId is Invalid');
    });
    it('should be accepted if request is valid', async () => {
      const contentIntegration = await test.getContentIntegration();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/contentIntegration/${contentIntegration?.id}`)
        .send({
          type: 'LLM',
          configJson: {
            apiKey: 'testapikey123 updated',
            provider: 'groq',
            model: 'test updated',
          },
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'ContentIntegration updated succesfully!!',
      );
      expect(response.body.data.type).toBe('LLM');
      expect(response.body.data.configJson.apiKey).toBe(
        'testapikey123 updated',
      );
      expect(response.body.data.configJson.model).toBe('test updated');
      expect(response.body.data.configJson.provider).toBe('groq');
    });
    it('patch should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/contentIntegration/aowkoakowko')
        .send({
          type: '',
          configJson: {},
          userIntegrationId: '',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });

    it('patch should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/contentIntegration/akwokwokw')
        .send({
          type: '',
          configJson: {},
          userIntegrationId: '',
        })
        .set('Cookie', [`access_token=Invalid_TOken`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('patch should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/contentIntegration/aokwokoa')
        .send({
          type: '',
          configJson: {},
          userIntegrationId: '',
        })
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('DELETE /api/contentIntegration/:id', () => {
    it('should be rejected if Id is not found', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .delete(`/api/contentIntegration/aakwokwowkok`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('ContentIntegrationId is Invalid');
    });
    // it('should be accepted if request is valid', async () => {
    // const contentIntegration = await test.getContentIntegration();
    //   const accessToken = await test.getAccessToken();
    //   const response = await request(app.getHttpServer())
    //     .delete(`/api/contentIntegration/${contentIntegration?.id}`)
    //     .set('Cookie', [`access_token=${accessToken}`]);

    //   expect(response.status).toBe(200);
    //   expect(response.body.message).toBe('ContentIntegration deleted succesfully!!');
    // });
    it('delete should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/contentIntegration/aowkowko',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });

    it('delete should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/contentIntegration/okwkaowkoawk')
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('delete should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/contentIntegration/akwokwkwoaowwoa')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });
});
