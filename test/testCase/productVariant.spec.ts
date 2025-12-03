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

describe('ProductVariantRouteTest', () => {
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

  describe('GET api/productVariant?productId=okoee', () => {
    it('should be accepted if user authentication and request valid', async () => {
      const product = await test.getProduct();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/productVariant?productId=${product?.id}`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('get should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/productVariant?productId=okoee',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('get should be rejected if request is invalid', async () => {
      const accessToken = await test.getAccessToken();

      const response = await request(app.getHttpServer())
        .get('/api/productVariant')
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    it('get should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/productVariant?productId=okoee')
        .set('Cookie', [`access_token=Invalid`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('get should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/productVariant?productId=okoee')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('POST /api/productVariant/generate', () => {
    it('should be posted if request is valid', async () => {
      const product = await test.getProduct();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .post('/api/productVariant/generate')
        .send({
          productId: product?.id,
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'ProductVariant generated succesfully!!',
      );
      expect(response.body.data).toBeDefined();
    });
    it('should be rejected if request is invalid', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .post('/api/productVariant/generate')
        .send({
          productId: '',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error!!');
    });
    it('post should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/productVariant/generate')
        .send({
          productId: '',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('post should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/productVariant/generate')
        .send({
          productId: '',
        })
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('post should be rejected if accessToken is expired', async () => {
      const bot = await test.getBot();

      const response = await request(app.getHttpServer())
        .post('/api/productVariant/generate')
        .send({
          productId: '',
        })
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('PATCH /api/productVariant/:id', () => {
    it('should be rejected if request is invalid', async () => {
      const productVariant = await test.getProduct();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/productVariant/${productVariant?.id}`)
        .send({
          price: 0,
          sku: '',
          stock: 0,
          image: '',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    it('should be rejected if Id is not found', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/productVariant/aokwokwokwko`)
        .send({
          price: 10000,
          sku: 'test',
          stock: 10,
          image: 'test',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('ProductVariantId is Invalid');
    });
    it('should be accepted if request is valid', async () => {
      const product = await test.getProduct();
      const productVariant = await test.getProductVariant(product?.id);
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/productVariant/${productVariant?.id}`)
        .send({
          price: 10000,
          sku: 'test',
          stock: 10,
          image: 'test',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'ProductVariant updated succesfully!!',
      );
      expect(response.body.data.price).toBe(10000);
      expect(response.body.data.sku).toBe('test');
      expect(response.body.data.image).toBe('test');
      expect(response.body.data.stock).toBe(10);
    });
    it('patch should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/productVariant/aowkoakowko')
        .send({
          price: 10000,
          sku: 'test',
          stock: 10,
          image: 'test',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });

    it('patch should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/productVariant/akwokwokw')
        .send({
          price: 10000,
          sku: 'test',
          stock: 10,
          image: 'test',
        })
        .set('Cookie', [`access_token=Invalid_TOken`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('patch should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/productVariant/aokwokoa')
        .send({
          price: 10000,
          sku: 'test',
          stock: 10,
          image: 'test',
        })
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('DELETE /api/productVariant/:id', () => {
    it('should be rejected if Id is not found', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .delete(`/api/productVariant/aakwokwowkok`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('ProductVariantId is Invalid');
    });
    // it('should be accepted if request is valid', async () => {
    //   const product = await test.getProduct();
    //   const productVariant = await test.getProductVariant(product?.id);
    //   const accessToken = await test.getAccessToken();
    //   const response = await request(app.getHttpServer())
    //     .delete(`/api/productVariant/${productVariant?.id}`)
    //     .set('Cookie', [`access_token=${accessToken}`]);

    //   expect(response.status).toBe(200);
    //   expect(response.body.message).toBe('ProductVariant deleted succesfully!!');
    // });
    it('delete should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/productVariant/aowkowko',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });

    it('delete should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/productVariant/okwkaowkoawk')
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('delete should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/productVariant/akwokwkwoaowwoa')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });
});
