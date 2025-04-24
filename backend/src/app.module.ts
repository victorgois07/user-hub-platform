import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UseCasesModule } from './application/use-cases/use-cases.module';
import { CacheModule } from './infra/cache/cache.module';
import { DatabaseModule } from './infra/database/database.module';
import { ControllerModule } from './presentation/controllers/controller.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    CacheModule,
    UseCasesModule,
    ControllerModule,
  ],
})
export class AppModule {}
