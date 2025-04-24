import { UserEntity } from '@/domain/entities/user.enity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(user: UserEntity): Promise<{ access_token: string }> {
    const payload = {
      email: user.email,
      document: user.document,
      documentType: user.documentType,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME', '1h'),
    });

    return { access_token };
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(userId: string, token: string): Promise<boolean> {
    try {
      const payload = await this.verifyToken(token);
      return payload.sub === userId;
    } catch (error) {
      return false;
    }
  }
}
