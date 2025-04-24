import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { Redis } from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  retryStrategy: (times: number) => Math.min(times * 1000, 3000),
});

@Global()
@Module({
  imports: [
    NestCacheModule.register({
      isGlobal: true,
      store: redisStore,
      redisInstance: redisClient,
      ttl: 60 * 60 * 24, // 24 hours
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}
