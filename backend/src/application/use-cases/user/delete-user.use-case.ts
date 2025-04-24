import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findByAny('id', id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
