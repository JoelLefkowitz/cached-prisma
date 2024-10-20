import { LruCache } from "./LruCache";
import { PrismaClient } from "@prisma/client";

export interface Cache {
  read: (key: string) => Promise<string | null>;
  write: (key: string, value: string) => Promise<void>;
  flush: () => Promise<void>;
}

export interface SingletonClient {
  cache?: Cache;
  client?: PrismaClient;
}

export const PureActions = [
  "aggregate",
  "count",
  "findFirst",
  "findMany",
  "findUnique",
  "queryRaw",
];

export const ImpureActions = [
  "create",
  "createMany",
  "delete",
  "deleteMany",
  "executeRaw",
  "update",
  "updateMany",
  "upsert",
];

export class Prisma {
  private static singleton: SingletonClient = {};

  cache: Cache;
  client: PrismaClient;

  constructor() {
    if (!Prisma.singleton.cache) {
      Prisma.singleton.cache = Prisma.cacheFactory();
    }

    if (!Prisma.singleton.client) {
      Prisma.singleton.client = Prisma.clientFactory();
    }

    this.client = Prisma.singleton.client;
    this.cache = Prisma.singleton.cache;
  }

  static cacheFactory = (): Cache => new LruCache(100);

  private static clientFactory(): PrismaClient {
    const client = new PrismaClient();

    for (const field of Object.getOwnPropertyNames(client).filter(
      (property: string) =>
        !property.startsWith("$") && !property.startsWith("_"),
    )) {
      for (const action of ImpureActions) {
        const pristine = client[field][action];

        client[field][action] = (...args: unknown[]) => {
          Prisma.singleton.cache?.flush();
          return pristine(...args);
        };
      }

      for (const action of PureActions) {
        const pristine = client[field][action];

        client[field][action] = async (...args: unknown[]) => {
          const key = JSON.stringify({ field, action, args });
          const cached = await Prisma.singleton.cache?.read(key);

          if (cached) {
            return JSON.parse(cached);
          }

          const evaluated = await pristine(...args);
          await Prisma.singleton.cache?.write(key, JSON.stringify(evaluated));
          return evaluated;
        };
      }
    }

    return client;
  }
}
