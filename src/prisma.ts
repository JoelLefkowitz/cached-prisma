import { FixedTuple } from "./local";
import { Memcached } from "./memcached";
import { PrismaClient } from "@prisma/client";

export type Maybe<T> = T | null;

export interface Cache {
  read: (key: string) => Maybe<string>;
  write: (key: string, value: string) => void;
}

export interface AsyncCache {
  read: (key: string) => Promise<Maybe<string>>;
  write: (key: string, value: string) => Promise<void>;
}

export const IdempotentActions = [
  "findUnique",
  "findMany",
  "findFirst",
  "queryRaw",
  "aggregate",
  "count",
];

export class Prisma {
  private static _cache: Cache | AsyncCache;
  private static _client: PrismaClient;

  get client(): PrismaClient {
    if (!Prisma._client) {
      Prisma._client = new PrismaClient();
      Prisma.cacheClientMethods();
    }

    if (!Prisma._cache) {
      Prisma._cache = new FixedTuple(100);
    }

    return Prisma._client;
  }

  static get publicClientMethods(): string[] {
    return Object.getOwnPropertyNames(Prisma._client).filter(
      (property: string) => !property.startsWith("_")
    );
  }

  static cacheClientMethods(): void {
    for (const field of Prisma.publicClientMethods) {
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

export class FPrisma extends Prisma {
  cache = new FixedTuple(200);
}

export class MPrisma extends Prisma {
  cache = new Memcached("127.0.0.1:11211", 10);
}
