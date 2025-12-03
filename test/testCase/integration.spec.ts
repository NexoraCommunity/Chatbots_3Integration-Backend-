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

describe('IntegrationRouteTest', () => {
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

  describe('GET api/integration', () => {
    it('should be accepted if user authentication and request valid', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/integration`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('get should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/integration',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('get should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/integration')
        .set('Cookie', [`access_token=Invalid`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('get should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/integration')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('POST /api/admin/integration', () => {
    it('should be posted if request is valid', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .post('/api/admin/integration')
        .send({
          name: 'test',
          type: 'test',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Integration created succesfully!!');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.type).toBe('test');
    });
    it('should be rejected if request is invalid', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .post('/api/admin/integration')
        .send({
          name: '',
          type: '',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    it('post should be rejected if unathorized', async () => {
      const bot = await test.getBot();
      const response = await request(app.getHttpServer())
        .post('/api/admin/integration')
        .send({
          name: 'test',
          type: 'test',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('post should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/admin/integration')
        .send({
          name: 'test',
          type: 'test',
        })
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('post should be rejected if accessToken is expired', async () => {
      const bot = await test.getBot();

      const response = await request(app.getHttpServer())
        .post('/api/admin/integration')
        .send({
          name: 'test',
          type: 'test',
        })
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('GET /api/integration/:id', () => {
    it('should be accepted if user authentication', async () => {
      const integration = await test.getIntegration();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/integration/${String(integration?.id)}`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test');
    });

    it('should be rejected if prommptId is invalid', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/integration/aokwokwowk`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('IntegrationId is Invalid');
    });
  });

  describe('PATCH /api/admin/integration/:id', () => {
    it('should be rejected if request is invalid', async () => {
      const integration = await test.getIntegration();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/admin/integration/${integration?.id}`)
        .send({
          name: '',
          type: '',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    it('should be rejected if Id is not found', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/admin/integration/aokwokwokwko`)
        .send({
          name: 'test',
          type: 'test',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('IntegrationId is Invalid');
    });
    it('should be accepted if request is valid', async () => {
      const integration = await test.getIntegration();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/admin/integration/${integration?.id}`)
        .send({
          name: 'test',
          type: 'test',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Integration updated succesfully!!');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.type).toBe('test');
    });
    it('patch should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/admin/integration/aowkoakowko')
        .send({
          name: 'test',
          type: 'test',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });

    it('patch should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/admin/integration/akwokwokw')
        .send({
          name: 'test',
          type: 'test',
        })
        .set('Cookie', [`access_token=Invalid_TOken`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('patch should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/admin/integration/aokwokoa')
        .send({
          name: 'test',
          type: 'test',
        })
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('DELETE /api/admin/integration/:id', () => {
    it('should be rejected if Id is not found', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .delete(`/api/admin/integration/aakwokwowkok`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('IntegrationId is Invalid');
    });
    // it('should be accepted if request is valid', async () => {
    // const integration = await test.getIntegration();
    //   const accessToken = await test.getAccessToken();
    //   const response = await request(app.getHttpServer())
    //     .delete(`/api/admin/integration/${message?.id}`)
    //     .set('Cookie', [`access_token=${accessToken}`]);

    //   expect(response.status).toBe(200);
    //   expect(response.body.message).toBe('Message deleted succesfully!!');
    // });
    it('delete should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/admin/integration/aowkowko',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });

    it('delete should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/admin/integration/okwkaowkoawk')
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('delete should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/admin/integration/akwokwkwoaowwoa')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });
});
