import { AsyncCache, Cache, ImpureActions, PureActions } from '../main';

import { LruCache } from '../caches/local';
import { PrismaClient } from '@prisma/client';

export type Transmutable = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export class Prisma {
  private static _client: PrismaClient;
  private static _cache: Cache | AsyncCache;

  cacheFactory = (): Cache | AsyncCache => new LruCache(100);

  flushCache(): void {
    Prisma._cache = this.cacheFactory();
  }

  get client(): PrismaClient {
    if (!Prisma._client) {
      Prisma._client = new PrismaClient();

      this.cacheClientMethods();
    }

    return Prisma._client;
  }

  get cache(): Cache | AsyncCache {
    if (!Prisma._cache) {
      this.flushCache();
    }

    return Prisma._cache;
  }

  get publicClientMethods(): string[] {
    return Object.getOwnPropertyNames(Prisma._client).filter(
      (property: string) => !property.startsWith('_')
    );
  }

  cacheClientMethods(): void {
    const client: Transmutable = this.client;
    const singleton: Transmutable = Prisma._client;

    for (const field of this.publicClientMethods) {
      for (const action of ImpureActions) {
        const pristine = client[field][action];

        client[field][action] = async (...args: unknown[]) => {
          this.flushCache();
          return await pristine(...args);
        };
      }

      for (const action of PureActions) {
        const pristine = client[field][action];

        singleton[field][action] = async (...args: unknown[]) => {
          const key = JSON.stringify({ field, action, args });
          const read = await this.cache.read(key);
          const cached = read ? JSON.parse(read) : null;

          if (!cached) {
            const evaluated = await pristine(...args);
            await this.cache.write(key, JSON.stringify(evaluated));
            return evaluated;
          }

          return cached;
        };
      }
    }
  }
}
