import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentType } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CacheModule } from '@/infra/cache/cache.module';
import { CacheModuleMock } from '../mocks/cache.module.mock';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideModule(CacheModule)
    .useModule(CacheModuleMock)
    .compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should authenticate user and return token', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: hashedPassword,
          document: '00000000001',
          documentType: DocumentType.CPF
        },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(typeof response.body.access_token).toBe('string');
    });

    it('should return 401 for invalid credentials', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: hashedPassword,
          document: '00000000002',
          documentType: DocumentType.CPF
        },
      });

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should return 401 for non-existent user', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);
    });
  });
});
