import { UserUseCasesModule } from '@/application/use-cases/user/user-use-cases.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  imports: [UserUseCasesModule],
  controllers: [UserController],
})
export class UserModule {}
