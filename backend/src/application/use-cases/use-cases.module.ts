import { Module } from '@nestjs/common';
import { AuthUseCasesModule } from './auth/auth-use-cases.module';
import { UserUseCasesModule } from './user/user-use-cases.module';

@Module({
  imports: [UserUseCasesModule, AuthUseCasesModule],
  exports: [UserUseCasesModule, AuthUseCasesModule],
})
export class UseCasesModule {}
