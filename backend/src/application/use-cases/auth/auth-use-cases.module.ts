import { RepositoryModule } from '@/infra/repositories/repository.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginUseCase } from './login.use-case';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME', '1d'),
        },
      }),
      inject: [ConfigService],
    }),
    RepositoryModule,
  ],
  providers: [LoginUseCase],
  exports: [LoginUseCase],
})
export class AuthUseCasesModule {}
