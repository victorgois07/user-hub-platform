import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByAny('email', email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      document: user.document,
      documentType: user.documentType,
    };

    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    return {
      access_token: this.jwtService.sign(payload, { secret }),
    };
  }
}
