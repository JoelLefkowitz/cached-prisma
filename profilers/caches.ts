import { LruCache, Memcached, Prisma, Redis } from "../src/main";

import { PrismaClient } from ".prisma/client";

class LruCachedPrisma extends Prisma {
  cacheFactory = () => new LruCache(10);
}

class MemcachedPrisma extends Prisma {
  cacheFactory = () => new Memcached("127.0.0.1:11211", 10);
}

class RedisPrisma extends Prisma {
  cacheFactory = () => new Redis("redis://127.0.0.0:6379", 10);
}

export const caches = [
  { name: "Without cache", cache: new PrismaClient() },
  { name: "LruMap cache", cache: new LruCachedPrisma().client },
  { name: "Memcached", cache: new MemcachedPrisma().client },
  { name: "Redis", cache: new RedisPrisma().client },
];
