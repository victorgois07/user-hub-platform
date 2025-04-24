import { RepositoryModule } from '@/infra/repositories/repository.module';
import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import { DeleteUserUseCase } from './delete-user.use-case';
import { FindUserByIdUseCase } from './find-user-by-id.use-case';
import { GetAllUsersUseCase } from './get-all-users.use-case';
import { UpdateUserUseCase } from './update-user.use-case';

@Module({
  imports: [RepositoryModule],
  providers: [
    CreateUserUseCase,
    FindUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetAllUsersUseCase,
  ],
  exports: [
    CreateUserUseCase,
    FindUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetAllUsersUseCase,
  ],
})
export class UserUseCasesModule {}
