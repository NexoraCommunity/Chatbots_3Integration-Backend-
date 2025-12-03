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

describe('UserIntegrationRouteTest', () => {
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

  describe('GET api/userIntegration', () => {
    it('should be accepted if user authentication and request valid', async () => {
      const user = await test.getUser();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/userIntegration?userId=${user?.id}`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('get should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/userIntegration',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('get should be rejected if request is invalid', async () => {
      const accessToken = await test.getAccessToken();

      const response = await request(app.getHttpServer())
        .get('/api/userIntegration')
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    });
    it('get should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/userIntegration')
        .set('Cookie', [`access_token=Invalid`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('get should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/userIntegration')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('POST /api/userIntegration', () => {
    it('should be posted if request is valid', async () => {
      const integration = await test.getIntegration();
      const user = await test.getUser();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .post('/api/userIntegration')
        .send({
          isconneted: true,
          integrationId: integration?.id,
          userId: user?.id,
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'UserIntegration created succesfully!!',
      );
      expect(response.body.data.isconneted).toBe(true);
    });
    it('should be rejected if request is invalid', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .post('/api/userIntegration')
        .send({
          connectedAt: 'new Date()',
          isconneted: '',
          integrationId: '',
          userId: '',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    it('post should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/userIntegration')
        .send({
          connectedAt: 'new Date()',
          isconneted: '',
          integrationId: '',
          userId: '',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('post should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/userIntegration')
        .send({
          connectedAt: 'new Date()',
          isconneted: '',
          integrationId: '',
          userId: '',
        })
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('post should be rejected if accessToken is expired', async () => {
      const bot = await test.getBot();

      const response = await request(app.getHttpServer())
        .post('/api/userIntegration')
        .send({
          connectedAt: 'new Date()',
          isconneted: '',
          integrationId: '',
          userId: '',
        })
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('GET /api/userIntegration/:id', () => {
    it('should be accepted if user authentication', async () => {
      const userIntegration = await test.getUserIntegration();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/userIntegration/${String(userIntegration?.id)}`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.data.isconneted).toBe(true);
    });

    it('should be rejected if userIntegrationId is invalid', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/userIntegration/aokwokwowk`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('UserIntegrationId is Invalid');
    });
  });

  describe('PATCH /api/admin/userIntegration/:id', () => {
    it('should be rejected if request is invalid', async () => {
      const userIntegration = await test.getUserIntegration();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/admin/userIntegration/${userIntegration?.id}`)
        .send({
          connectedAt: 'new Date()',
          isconneted: '',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    it('should be rejected if Id is not found', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/admin/userIntegration/1`)
        .send({
          connectedAt: new Date(),
          isconneted: true,
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('UserIntegrationId is Invalid');
    });
    it('should be accepted if request is valid', async () => {
      const userIntegration = await test.getUserIntegration();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/admin/userIntegration/${userIntegration?.id}`)
        .send({
          connectedAt: new Date(),
          isconneted: true,
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'UserIntegration updated succesfully!!',
      );
      expect(response.body.data.isconneted).toBe(true);
    });
    it('patch should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/admin/userIntegration/aowkoakowko')
        .send({
          connectedAt: 'new Date()',
          isconneted: '',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });

    it('patch should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/admin/userIntegration/akwokwokw')
        .send({
          connectedAt: 'new Date()',
          isconneted: '',
        })
        .set('Cookie', [`access_token=Invalid_TOken`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('patch should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/admin/userIntegration/aokwokoa')
        .send({
          connectedAt: 'new Date()',
          isconneted: '',
        })
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('DELETE /api/admin/userIntegration/:id', () => {
    it('should be rejected if Id is not found', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .delete(`/api/admin/userIntegration/aakwokwowkok`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('UserIntegrationId is Invalid');
    });
    // it('should be accepted if request is valid', async () => {
    // const userIntegration = await test.getUserIntegration();
    //   const accessToken = await test.getAccessToken();
    //   const response = await request(app.getHttpServer())
    //     .delete(`/api/admin/userIntegration/${userIntegration?.id}`)
    //     .set('Cookie', [`access_token=${accessToken}`]);

    //   expect(response.status).toBe(200);
    //   expect(response.body.message).toBe('UserIntegration deleted succesfully!!');
    // });
    it('delete should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/admin/userIntegration/aowkowko',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });

    it('delete should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/admin/userIntegration/okwkaowkoawk')
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('delete should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/admin/userIntegration/akwokwkwoaowwoa')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });
});
