import { Memcached, Prisma, Redis } from "../../src";

import { PrismaClient } from ".prisma/client";

class MemcachedPrisma extends Prisma {
  static override cacheFactory = () => new Memcached("127.0.0.1:11211", 10);
}

class RedisPrisma extends Prisma {
  static override cacheFactory = () =>
    new Redis({
      lifetime: 10,
      redisOptions: { host: "127.0.0.1", port: 6379 },
      cacheKeyPrefix: "cache",
    });
}

export const caches = [
  { name: "Without cache", cache: new PrismaClient() },
  { name: "LruMap cache", cache: new Prisma().client },
  { name: "Memcached cache", cache: new MemcachedPrisma().client },
  { name: "Redis cache", cache: new RedisPrisma().client },
];
