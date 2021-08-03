import { AsyncCache, Cache, IdempotentActions } from '../types';

import { LruCache } from '../caches/local';
import { PrismaClient } from '@prisma/client';

export class Prisma {
  private static _client: PrismaClient;
  private static _cache: Cache | AsyncCache;

  // We don't want this to be static so that it can be overridden.
  cacheFactory = (): Cache => new LruCache(100);

  static flushCache(): void {
    delete Prisma._cache;
  }

  get client(): PrismaClient {
    if (!Prisma._client) {
      Prisma._client = new PrismaClient();
    }

    if (!Prisma._cache) {
      Prisma._cache = this.cacheFactory();
      this.cacheClientMethods();
    }

    return Prisma._client;
  }

  get publicClientMethods(): string[] {
    return Object.getOwnPropertyNames(Prisma._client).filter(
      (property: string) => !property.startsWith('_')
    );
  }

  cacheClientMethods(): void {
    for (const field of this.publicClientMethods) {
      for (const action of IdempotentActions) {
        const pristine = Prisma._client[field][action];

        Prisma._client[field][action] = async (...args: unknown[]) => {
          const key = JSON.stringify({ field, action, args });
          const cached = JSON.parse(await Prisma._cache.read(key));

          if (!cached) {
            const evaluated = JSON.stringify(await pristine(...args));
            await Prisma._cache.write(key, evaluated);
            return evaluated;
          }

          return cached;
        };
      }
    }
  }
}
