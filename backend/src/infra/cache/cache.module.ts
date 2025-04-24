import {
  CacheModuleAsyncOptions,
  CacheModule as NestCacheModule,
} from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';

@Global()
@Module({
  imports: [
    NestCacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      ttl: 60 * 60 * 24,
      retryStrategy: (times: number) => Math.min(times * 1000, 3000),
    } as CacheModuleAsyncOptions),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}
