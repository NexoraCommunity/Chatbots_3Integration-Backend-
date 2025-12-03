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

describe('UserRouteTest', () => {
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

  describe('GET /api/user current user', () => {
    it('should be accepted if user authentication', async () => {
      const accessToken = await test.getAccessToken();
      const user = await test.getUser();
      const response = await request(app.getHttpServer())
        .get(`/api/user`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successfuly get current user!!');
      expect(response.body.data.firstName).toBe(user?.firstName);
      expect(response.body.data.lastName).toBe(user?.lastName);
      expect(response.body.data.email).toBe(user?.email);
      expect(response.body.data.picture).toBe(user?.picture);
      expect(response.body.data.id).toBe(user?.id);
    });
    it('get should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).get('/api/user');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('get should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/user')
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('get should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/user')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('POST /api/user/sendOtp', () => {
    it('should be accepted if user authentication', async () => {
      const accessToken = await test.getAccessToken();
      const user = await test.getUser();
      const response = await request(app.getHttpServer())
        .post(`/api/user/sendOtp`)
        .set('Cookie', [`access_token=${accessToken}`])
        .send({
          email: 'testnexoraoraora@gmail.com',
          id: user?.id,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Verification Send!!');
    });
    it('should be rejected if request invalid', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .post(`/api/user/sendOtp`)
        .set('Cookie', [`access_token=${accessToken}`])
        .send({
          email: '',
          id: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    it('post should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).post(
        '/api/user/sendOtp',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('post should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/sendOtp')
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('post should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/sendOtp')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });
  describe('POST /api/user/password ', () => {
    it('should be rejected if request codeOTP is Invalid', async () => {
      const accessToken = await test.getAccessToken();
      const http = await request(app.getHttpServer());
      const url = http.post('/api/user/password');
      const user = await test.getUser();

      const response = await url
        .send({
          codeOTP: '000000',
          email: 'testnexoraoraora@gmail.com',
          password: 'testchange123.',
          id: user?.id,
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid OTP code!!');
    });
    it('should be accepted if user authentication', async () => {
      const accessToken = await test.getAccessToken();
      const user = await test.GetOTPUser();
      const response = await request(app.getHttpServer())
        .post(`/api/user/password`)
        .set('Cookie', [`access_token=${accessToken}`])

        .send({
          email: 'testnexoraoraora@gmail.com',
          password: 'testchange123.',
          codeOTP: user?.userOtp[0].otpCode,
          id: user?.id,
        });
      await test.AddNewExpiredOTP(String(user?.id));

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password updated successfuly!!');
    });
    it('should be rejected if request invalid', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .post(`/api/user/password`)
        .set('Cookie', [`access_token=${accessToken}`])
        .send({
          email: '',
          password: '',
          codeOTP: '',
          id: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    it('post should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).post(
        '/api/user/password',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('post should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/password')
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('post should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/password')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });

    it('should be rejected if request codeOTP is Expired', async () => {
      const accessToken = await test.getAccessToken();
      const http = await request(app.getHttpServer());
      const url = http.post('/api/user/password');
      const user = await test.getUser();
      const OTP = await test.GetOTPUser();

      expect(OTP?.userOtp[0].otpCode).toBe('109109');

      const response = await url
        .send({
          codeOTP: OTP?.userOtp[0].otpCode,
          email: 'testnexoraoraora@gmail.com',
          password: 'testchange123.',
          id: user?.id,
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('OTP code is expired!!');
    });
  });
  describe('PATCH /api/user/:id current user', () => {
    it('should be accepted if user authentication', async () => {
      const accessToken = await test.getAccessToken();
      const user = await test.getUser();
      const response = await request(app.getHttpServer())
        .patch(`/api/user/${user?.id}`)
        .set('Cookie', [`access_token=${accessToken}`])
        .send({
          firstName: 'testUpdated',
          lastName: 'testUpdated',
          picture: 'testUpdated',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User updated successfuly!!');
      expect(response.body.data.firstName).toBe('testUpdated');
      expect(response.body.data.lastName).toBe('testUpdated');
      expect(response.body.data.picture).toBe('testUpdated');
    });
    it('should be rejected if Id is not found', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/user/aokwokawok`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('UserId is Invalid');
    });
    it('patch should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).patch('/api/user/id');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('patch should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/user/id')
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('patch should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/user/id')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('DELETE /api/user/:id current user', () => {
    it('delete should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/admin/user/id',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('delete should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/admin/user/id')
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('delete should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/admin/user/id')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });

    it('should be rejected if Id is not found', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .delete(`/api/admin/user/aoaokwokwokw`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('UserId is Invalid');
    });
  });
});
