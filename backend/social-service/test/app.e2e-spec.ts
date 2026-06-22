import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /likes/:productId → returns count', () => {
    return request(app.getHttpServer())
      .get('/likes/550e8400-e29b-41d4-a716-446655440000')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('count');
        expect(res.body).toHaveProperty('productId');
      });
  });

  it('POST /likes → returns 400 on invalid body', () => {
    return request(app.getHttpServer())
      .post('/likes')
      .send({ productId: 'not-a-uuid' })
      .expect(400);
  });

  it('GET /comments/:productId → returns paginated comments', () => {
    return request(app.getHttpServer())
      .get('/comments/550e8400-e29b-41d4-a716-446655440000')
      .query({ page: 1, limit: 5 })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('meta');
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('GET /shares/:productId → returns total shares', () => {
    return request(app.getHttpServer())
      .get('/shares/550e8400-e29b-41d4-a716-446655440000')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('totalShares');
      });
  });
});
