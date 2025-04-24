import { CreateUserDto } from '@/domain/dto/create-user.dto';
import { PaginationQueryDto } from '@/domain/dto/pagination-query.dto';
import {
  IUserRepository,
  UserWithoutPassword,
} from '@/domain/repositories/user.repository.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Cache } from 'cache-manager';
import { UserRepository } from './user.repository';

@Injectable()
export class UserRepositoryFacade implements IUserRepository {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private getCacheKey(pagination: PaginationQueryDto): string {
    return `users:list:${JSON.stringify(pagination)}`;
  }

  private async clearCache(): Promise<void> {
    const keys = await this.cacheManager.store.keys('users:list:*');
    await Promise.all([...keys.map((key) => this.cacheManager.del(key))]);
  }

  async findAll(
    pagination: PaginationQueryDto,
  ): Promise<UserWithoutPassword[]> {
    const cacheKey = this.getCacheKey(pagination);
    const cachedData =
      await this.cacheManager.get<UserWithoutPassword[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const users = await this.userRepository.findAll(pagination);
    await this.cacheManager.set(cacheKey, users);
    return users;
  }

  async findByAny<K extends keyof User>(
    key: K,
    value: User[K],
  ): Promise<User | null> {
    return this.userRepository.findByAny(key, value);
  }

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    const user = await this.userRepository.create(data);
    await this.clearCache();
    return user;
  }

  async update(id: string, data: Partial<CreateUserDto>): Promise<User> {
    const user = await this.userRepository.update(id, data);
    await this.clearCache();
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
    await this.clearCache();
  }

  async count(): Promise<number> {
    return this.userRepository.count();
  }
}
