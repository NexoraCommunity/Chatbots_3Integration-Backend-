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

describe('VariantOptionRouteTest', () => {
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

  describe('GET api/variantOption?productId=okoee', () => {
    it('should be accepted if user authentication and request valid', async () => {
      const product = await test.getProduct();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/variantOption?productId=${product?.id}`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('get should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/variantOption?productId=okoee',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('get should be rejected if request is invalid', async () => {
      const accessToken = await test.getAccessToken();

      const response = await request(app.getHttpServer())
        .get('/api/variantOption')
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    it('get should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/variantOption?productId=okoee')
        .set('Cookie', [`access_token=Invalid`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('get should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/variantOption?productId=okoee')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('POST /api/variantOption', () => {
    it('should be posted if request is valid', async () => {
      const product = await test.getProduct();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .post('/api/variantOption')
        .send({
          productId: product?.id,
          name: 'test',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('VariantOption created succesfully!!');
      expect(response.body.data.name).toBe('test');
    });
    it('should be rejected if request is invalid', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .post('/api/variantOption')
        .send({
          productId: '',
          name: '',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    it('post should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/variantOption')
        .send({
          productId: '',
          name: '',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('post should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/variantOption')
        .send({
          productId: '',
          name: '',
        })
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('post should be rejected if accessToken is expired', async () => {
      const bot = await test.getBot();

      const response = await request(app.getHttpServer())
        .post('/api/variantOption')
        .send({
          productId: '',
          name: '',
        })
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('GET /api/variantOption/:id', () => {
    it('should be accepted if user authentication', async () => {
      const variantOption = await test.getVariantOption();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/variantOption/${String(variantOption?.id)}`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test');
    });

    it('should be rejected if variantOptionId is invalid', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/variantOption/aokwokwowk`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VariantOptionId is Invalid');
    });
  });

  describe('DELETE /api/variantOption/:id', () => {
    it('should be rejected if Id is not found', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .delete(`/api/variantOption/aakwokwowkok`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VariantOptionId is Invalid');
    });
    // it('should be accepted if request is valid', async () => {
    // const variantOption = await test.getVariantOption();
    //   const accessToken = await test.getAccessToken();
    //   const response = await request(app.getHttpServer())
    //     .delete(`/api/variantOption/${variantOption?.id}`)
    //     .set('Cookie', [`access_token=${accessToken}`]);

    //   expect(response.status).toBe(200);
    //   expect(response.body.message).toBe('VariantOption deleted succesfully!!');
    // });
    it('delete should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/variantOption/aowkowko',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });

    it('delete should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/variantOption/okwkaowkoawk')
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('delete should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/variantOption/akwokwkwoaowwoa')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });
});
