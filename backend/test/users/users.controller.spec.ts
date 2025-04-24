import { CreateUserUseCase } from '@/application/use-cases/user/create-user.use-case';
import { UserEntity } from '@/domain/entities/user.enity';
import { PrismaUserRepository } from '@/infra/repositories/user.repository';
import { UserController } from '@/presentation/user/user.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthProvider, UserRole, UserStatus } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: CreateUserUseCase;
  let userRepository: PrismaUserRepository;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    provider: AuthProvider.LOCAL,
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: PrismaUserRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockUser]),
            findById: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue(mockUser),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get<PrismaUserRepository>(PrismaUserRepository);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await controller.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(userRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockUser);
      expect(userRepository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newPassword123',
      };

      const result = await controller.update('1', updateUserDto);
      expect(result).toEqual(mockUser);
      expect(userRepository.update).toHaveBeenCalledWith('1', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      await controller.remove('1');
      expect(userRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
