import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentType } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@/infra/cache/cache.module';
import { CacheModuleMock } from '../mocks/cache.module.mock';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideModule(CacheModule)
    .useModule(CacheModuleMock)
    .compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);
    configService = app.get<ConfigService>(ConfigService);

    await app.init();

    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'admin@example.com',
        password: hashedPassword,
        document: '00000000001',
        documentType: DocumentType.CPF
      },
    });

    const payload = {
      email: user.email,
      document: user.document,
      documentType: user.documentType,
    };

    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    authToken = jwtService.sign(payload, { secret });
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'admin@example.com',
        password: hashedPassword,
        document: '00000000001',
        documentType: DocumentType.CPF
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        password: 'password123',
        document: '00000000002',
        documentType: DocumentType.CPF
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.firstName).toBe(createUserDto.firstName);
      expect(response.body.lastName).toBe(createUserDto.lastName);
      expect(response.body.email).toBe(createUserDto.email);
    });
  });

  describe('/users (GET)', () => {
    it('should return all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a user by id', async () => {
      const user = await prisma.user.create({
        data: {
          firstName: 'Test2',
          lastName: 'User2',
          email: 'test2@example.com',
          password: 'hashedPassword',
          document: '00000000003',
          documentType: DocumentType.CPF
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(user.id);
      expect(response.body.firstName).toBe(user.firstName);
      expect(response.body.lastName).toBe(user.lastName);
      expect(response.body.email).toBe(user.email);
    });
  });

  describe('/users/:id (PUT)', () => {
    it('should update a user', async () => {
      const user = await prisma.user.create({
        data: {
          firstName: 'Test3',
          lastName: 'User3',
          email: 'test3@example.com',
          password: 'hashedPassword',
          document: '00000000004',
          documentType: DocumentType.CPF
        },
      });

      const updateUserDto = {
        firstName: 'Updated',
        lastName: 'User',
        email: 'updated3@example.com',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/${user.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateUserDto)
        .expect(200);

      expect(response.body.firstName).toBe(updateUserDto.firstName);
      expect(response.body.lastName).toBe(updateUserDto.lastName);
      expect(response.body.email).toBe(updateUserDto.email);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should delete a user', async () => {
      const user = await prisma.user.create({
        data: {
          firstName: 'Test4',
          lastName: 'User4',
          email: 'test4@example.com',
          password: 'hashedPassword',
          document: '00000000005',
          documentType: DocumentType.CPF
        },
      });

      await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deletedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      expect(deletedUser).toBeNull();
    });
  });
});
