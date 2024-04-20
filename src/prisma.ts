import { LruCache } from "./LruCache";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { PrismaClient } from "@prisma/client";

export interface Cache {
  read: (key: string) => Promise<string | null>;
  write: (key: string, value: string) => Promise<void>;
  flush: () => Promise<void>;
}

export interface SingletonClient {
  cache?: Cache;
  client?: PrismaClient;
  logger?: unknown;
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
  logger?: Console;

  constructor(logger: Console = console) {
    logger?.log("new prisma instance");
    this.logger = logger;
    if (!Prisma.singleton.cache) {
      this.logger?.warn("DB Caching is enabled");
      Prisma.singleton.cache = Prisma.cacheFactory();
    }

    if (!Prisma.singleton.client) {
      Prisma.singleton.client = Prisma.clientFactory(this.logger);
    }

    this.client = Prisma.singleton.client;
    this.cache = Prisma.singleton.cache;
  }

  static cacheFactory = (_params?: unknown): Cache => new LruCache(100);

  private static clientFactory(logger?: Console): PrismaClient {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = new PrismaClient();

    for (const field of Object.getOwnPropertyNames(client).filter(
      (property: string) =>
        !property.startsWith("$") && !property.startsWith("_"),
    )) {
      for (const action of ImpureActions) {
        logger?.debug(`${field}.${action}: cache flush.`);
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
            logger?.debug(`Cache hit for ${key}`);
            return JSON.parse(cached);
          }
          logger?.debug(`Cache miss for ${key}`);
          const evaluated = await pristine(...args);
          await Prisma.singleton.cache?.write(key, JSON.stringify(evaluated));
          return evaluated;
        };
      }
    }

    return client;
  }

  protected setLogger(logger: Console): void {
    this.logger = logger;
  }
}
