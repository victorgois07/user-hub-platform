import { CreateUserDto } from '@/domain/dto/create-user.dto';
import { UserEntity } from '@/domain/entities/user.enity';
import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UpdateUserUseCase {
  private readonly saltRounds: number;

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
  ) {
    this.saltRounds = this.configService.get<number>(
      'security.bcrypt.saltRounds',
      12,
    );
  }

  async execute(id: string, updates: Partial<CreateUserDto>) {
    const user = await this.userRepository.findByAny('id', id);

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, this.saltRounds);
    }

    if (updates.document) {
      updates.document = updates.document.replace(/\D/g, '');
    }

    const updated = await this.userRepository.update(id, updates);
    const { password, ...safeUser } = updated;

    return new UserEntity(safeUser);
  }
}
