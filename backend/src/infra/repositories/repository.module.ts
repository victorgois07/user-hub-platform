import { Module } from '@nestjs/common';
import { CacheModule } from '../cache/cache.module';
import { DatabaseModule } from '../database/database.module';
import { UserRepositoryFacade } from './user-repository.facade';
import { UserRepository } from './user.repository';

@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [
    UserRepository,
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryFacade,
    },
  ],
  exports: ['IUserRepository'],
})
export class RepositoryModule {}
