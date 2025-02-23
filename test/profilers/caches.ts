import { LfuCache, LruCache, Memcached, Prisma, Redis } from "../../src";
import { PrismaClient } from ".prisma/client";

class LruCachePrisma extends Prisma {
  static override cacheFactory = () => new LruCache(1000);
}

class LfuCachePrisma extends Prisma {
  static override cacheFactory = () => new LfuCache(1000);
}

class MemcachedPrisma extends Prisma {
  static override cacheFactory = () => new Memcached("127.0.0.1", 11211, 10);
}

class RedisPrisma extends Prisma {
  static override cacheFactory = () => new Redis("127.0.0.1", 6379, 10);
}

export const caches = [
  { name: "Without cache", cache: new PrismaClient() },
  { name: "LruCache cache", cache: new LruCachePrisma().client },
  { name: "LfuCache cache", cache: new LfuCachePrisma().client },
  { name: "Memcached cache", cache: new MemcachedPrisma().client },
  { name: "Redis cache", cache: new RedisPrisma().client },
];
