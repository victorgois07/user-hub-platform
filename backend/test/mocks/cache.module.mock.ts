import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { Store } from 'cache-manager';

class MemoryStore implements Store {
  private store = new Map<string, any>();

  async get<T>(key: string): Promise<T | undefined> {
    return this.store.get(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    this.store.set(key, value);
    if (ttl) {
      setTimeout(() => this.store.delete(key), ttl * 1000);
    }
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async reset(): Promise<void> {
    this.store.clear();
  }

  async keys(pattern?: string): Promise<string[]> {
    if (!pattern) {
      return Array.from(this.store.keys());
    }
    const regex = new RegExp(pattern.replace('*', '.*'));
    return Array.from(this.store.keys()).filter((key) => regex.test(key));
  }

  async mset(args: [string, any][], ttl?: number): Promise<void> {
    await Promise.all(args.map(([key, value]) => this.set(key, value, ttl)));
  }

  async mget(...args: string[]): Promise<any[]> {
    return Promise.all(args.map((key) => this.get(key)));
  }

  async mdel(...args: string[]): Promise<void> {
    await Promise.all(args.map((key) => this.del(key)));
  }

  async ttl(key: string): Promise<number> {
    return this.store.has(key) ? 0 : -2;
  }
}

@Global()
@Module({
  imports: [
    NestCacheModule.register({
      isGlobal: true,
      store: new MemoryStore(),
      ttl: 60 * 60 * 24,
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModuleMock {}
