import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findByAny('id', id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }
}
