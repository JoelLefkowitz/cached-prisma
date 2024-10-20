import { Memcached, Prisma, Redis } from "../../src";

import { PrismaClient } from ".prisma/client";

class MemcachedPrisma extends Prisma {
  static override cacheFactory = () => new Memcached();
}

class RedisPrisma extends Prisma {
  static override cacheFactory = () => new Redis();
}

export const caches = [
  { name: "Without cache", cache: new PrismaClient() },
  { name: "LruMap cache", cache: new Prisma().client },
  { name: "Memcached cache", cache: new MemcachedPrisma().client },
  { name: "Redis cache", cache: new RedisPrisma().client },
];
