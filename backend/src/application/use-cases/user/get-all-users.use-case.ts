import { PaginationQueryDto } from '@/domain/dto/pagination-query.dto';
import { UserPaginationResponseDto } from '@/domain/dto/user-pagination-response.dto';
import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    pagination: PaginationQueryDto,
  ): Promise<UserPaginationResponseDto> {
    const users = await this.userRepository.findAll(pagination);
    const total = await this.userRepository.count();

    return {
      data: users,
      total,
      page: pagination.page ?? 1,
      limit: pagination.limit ?? 10,
      totalPages: Math.ceil(total / (pagination.limit ?? 10)),
    };
  }
}
