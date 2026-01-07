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

describe('ProductRouteTest', () => {
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

  describe('GET api/product?page=2&limit=2&userId=oko', () => {
    it('should be accepted if user authentication and request valid', async () => {
      const user = await test.getUser();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/product?page=2&limit=2&userId=${user?.id}`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('get should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/product?page=2&limit=2',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('get should be rejected if request is invalid', async () => {
      const accessToken = await test.getAccessToken();

      const response = await request(app.getHttpServer())
        .get('/api/product')
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    it('get should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/product?page=2&limit=2&userId=okow')
        .set('Cookie', [`access_token=Invalid`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('get should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/product?page=2&limit=2&userId=okow')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('POST /api/product', () => {
    it('should be posted if request is valid', async () => {
      const category = await test.getCategory();
      const user = await test.getUser();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .post('/api/product')
        .send({
          userId: user?.id,
          categoryId: category?.id,
          name: 'test',
          description: 'test',
          price: 10000,
          stock: 30,
          weight: 3,
          image: 'test',
          sku: 'test',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product created succesfully!!');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.description).toBe('test');
      expect(response.body.data.price).toBe(10000);
      expect(response.body.data.stock).toBe(30);
      expect(response.body.data.weight).toBe(3);
      expect(response.body.data.image).toBe('/uploads/image/undefined');
      expect(response.body.data.sku).toBe('test');
    });
    it('should be rejected if request is invalid', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .post('/api/product')
        .send({
          userId: '',
          categoryId: '',
          name: '',
          description: '',
          price: 0,
          stock: 0,
          weight: 3,
          image: '',
          sku: '',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    it('post should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/product')
        .send({
          userId: '',
          categoryId: '',
          name: '',
          description: '',
          price: 0,
          stock: 0,
          weight: 3,
          image: '',
          sku: '',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });
    it('post should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/product')
        .send({
          userId: '',
          categoryId: '',
          name: '',
          description: '',
          price: 0,
          stock: 0,
          weight: 3,
          image: '',
          sku: '',
        })
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('post should be rejected if accessToken is expired', async () => {
      const bot = await test.getBot();

      const response = await request(app.getHttpServer())
        .post('/api/product')
        .send({
          userId: '',
          categoryId: '',
          name: '',
          description: '',
          price: 0,
          stock: 0,
          weight: 3,
          image: '',
          sku: '',
        })
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('GET /api/product/:id', () => {
    it('should be accepted if user authentication', async () => {
      const product = await test.getProduct();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/product/${String(product?.id)}`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.description).toBe('test');
      expect(response.body.data.price).toBe(10000);
      expect(response.body.data.stock).toBe(30);
      expect(response.body.data.weight).toBe(3);
      expect(response.body.data.image).toBe('/uploads/image/undefined');
      expect(response.body.data.sku).toBe('test');
    });

    it('should be rejected if productId is invalid', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .get(`/api/product/aokwokwowk`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('ProductId is Invalid');
    });
  });

  describe('PATCH /api/product/:id', () => {
    it('should be rejected if request is invalid', async () => {
      const product = await test.getProduct();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/product/${product?.id}`)
        .send({
          userId: '',
          categoryId: '',
          name: '',
          description: '',
          price: 0,
          stock: 0,
          weight: 3,
          image: '',
          sku: '',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    it('should be rejected if Id is not found', async () => {
      const category = await test.getCategory();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/product/155`)
        .send({
          categoryId: category?.id,
          name: 'test',
          description: 'test updated',
          price: 10000,
          stock: 30,
          weight: 3,
          image: '/uploads/image/undefined',
          sku: 'test updated',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('ProductId is Invalid');
    });
    it('should be accepted if request is valid', async () => {
      const product = await test.getProduct();
      const category = await test.getCategory();
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .patch(`/api/product/${product?.id}`)
        .send({
          categoryId: category?.id,
          name: 'test',
          description: 'test updated',
          price: 10000,
          stock: 30,
          weight: 3,
          image: '/uploads/image/undefined',
          sku: 'test updated',
        })
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product updated succesfully!!');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.description).toBe('test updated');
      expect(response.body.data.price).toBe(10000);
      expect(response.body.data.stock).toBe(30);
      expect(response.body.data.weight).toBe(3);
      expect(response.body.data.image).toBe('/uploads/image/undefined');
      expect(response.body.data.sku).toBe('test updated');
    });
    it('patch should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/product/aowkoakowko')
        .send({
          userId: '',
          categoryId: '',
          name: '',
          description: '',
          price: 0,
          stock: 0,
          weight: 3,
          image: '',
          sku: '',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });

    it('patch should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/product/akwokwokw')
        .send({
          userId: '',
          categoryId: '',
          name: '',
          description: '',
          price: 0,
          stock: 0,
          weight: 3,
          image: '',
          sku: '',
        })
        .set('Cookie', [`access_token=Invalid_TOken`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('patch should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/product/aokwokoa')
        .send({
          userId: '',
          categoryId: '',
          name: '',
          description: '',
          price: 0,
          stock: 0,
          weight: 3,
          image: '',
          sku: '',
        })
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });

  describe('DELETE /api/product/:id', () => {
    it('should be rejected if Id is not found', async () => {
      const accessToken = await test.getAccessToken();
      const response = await request(app.getHttpServer())
        .delete(`/api/product/aakwokwowkok`)
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('ProductId is Invalid');
    });
    // it('should be accepted if request is valid', async () => {
    // const product = await test.getProduct();
    //   const accessToken = await test.getAccessToken();
    //   const response = await request(app.getHttpServer())
    //     .delete(`/api/product/${product?.id}`)
    //     .set('Cookie', [`access_token=${accessToken}`]);

    //   expect(response.status).toBe(200);
    //   expect(response.body.message).toBe('Product deleted succesfully!!');
    // });
    it('delete should be rejected if unathorized', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/product/aowkowko',
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized!!');
    });

    it('delete should be rejected if accessToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/product/okwkaowkoawk')
        .set('Cookie', [`access_token=Invalid_Token`]);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid access token!!');
    });
    it('delete should be rejected if accessToken is expired', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/product/akwokwkwoaowwoa')
        .set('Cookie', [
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTZmODUxYi1kNjNjLTQwYzUtOWRiOS0xZTY1Mzg3NjVjZjYiLCJpYXQiOjE3NjE2NzQ4NjksImV4cCI6MTc2MTY3NTc2OX0.MS4KXwAUWNdCTeT21F9kSOoPqdrQoZ__0wSIbGtJzEY',
        ]);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Access token expired!!');
    });
  });
});
