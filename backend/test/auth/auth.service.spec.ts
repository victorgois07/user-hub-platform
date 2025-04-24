import { User } from '@/domain/entities/user.entity';
import { PrismaUserRepository } from '@/infra/repositories/user.repository';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../src/infra/auth/auth.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: PrismaUserRepository;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    role: 'USER',
    provider: 'LOCAL',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaUserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<PrismaUserRepository>(PrismaUserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        provider: mockUser.provider,
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        service.validateUser('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrongPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateOAuthUser', () => {
    it('should create new user when not found', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.validateOAuthUser(
        'test@example.com',
        'GOOGLE',
        'oauth123',
      );

      expect(userRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'test',
        provider: 'GOOGLE',
        oauthId: 'oauth123',
        role: 'USER',
        status: 'ACTIVE',
        permissions: [],
      });
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        provider: mockUser.provider,
      });
    });

    it('should update existing user when provider changes', async () => {
      const existingUser = { ...mockUser, provider: 'LOCAL' };
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(existingUser);
      (userRepository.update as jest.Mock).mockResolvedValue({
        ...existingUser,
        provider: 'GOOGLE',
      });

      const result = await service.validateOAuthUser(
        'test@example.com',
        'GOOGLE',
        'oauth123',
      );

      expect(userRepository.update).toHaveBeenCalledWith(existingUser.id, {
        provider: 'GOOGLE',
        oauthId: 'oauth123',
      });
      expect(result.getProvider()).toBe('GOOGLE');
    });
  });

  describe('login', () => {
    it('should return access token and user data', async () => {
      const result = await service.login(mockUser as unknown as User);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
      expect(result).toEqual({
        access_token: 'mockToken',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          provider: mockUser.provider,
        },
      });
    });
  });
});
