import { CreateUserDto } from '@/domain/dto/create-user.dto';
import { PaginationQueryDto } from '@/domain/dto/pagination-query.dto';
import {
  IUserRepository,
  UserWithoutPassword,
} from '@/domain/repositories/user.repository.interface';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    pagination: PaginationQueryDto,
  ): Promise<UserWithoutPassword[]> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = pagination;

    const skip = (page - 1) * limit;

    return this.prisma.user.findMany({
      skip,
      take: limit,
      orderBy: {
        [sortBy as keyof User]: sortOrder,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        document: true,
        documentType: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
  }

  async findByAny<K extends keyof User>(
    key: K,
    value: User[K],
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        [key]: value,
      },
    });
  }

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: Partial<CreateUserDto>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }
}
