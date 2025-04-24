import { User } from '@prisma/client';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

export type UserWithoutPassword = Omit<User, 'password'>;

export interface IUserRepository {
  findAll(pagination: PaginationQueryDto): Promise<Omit<User, 'password'>[]>;
  findByAny<K extends keyof User>(key: K, value: User[K]): Promise<User | null>;
  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(
    id: string,
    data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<User>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}
