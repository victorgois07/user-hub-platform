import { CreateUserDto } from '@/domain/dto/create-user.dto';
import { UserEntity } from '@/domain/entities/user.enity';
import { UserRepository } from '@/infra/repositories/user.repository';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CreateUserUseCase {
  private readonly saltRounds: number;

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    this.saltRounds = this.configService.get<number>(
      'security.bcrypt.saltRounds',
      12,
    );
  }

  async execute(data: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByAny(
      'email',
      data.email,
    );

    if (existingUser) {
      throw new ConflictException('E-mail já está em uso.');
    }

    const existingDocument = await this.userRepository.findByAny(
      'document',
      data.document,
    );

    if (existingDocument) {
      throw new ConflictException('Documento já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const { password, ...safeUser } = user;

    return new UserEntity(safeUser);
  }
}
