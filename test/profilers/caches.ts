import { Memcached, Prisma } from "../../src";

import { PrismaClient } from ".prisma/client";

class MemcachedPrisma extends Prisma {
  static override cacheFactory = () => new Memcached("127.0.0.1:11211", 10);
}

export const caches = [
  { name: "Without cache", cache: new PrismaClient() },
  { name: "LruMap cache", cache: new Prisma().client },
  { name: "Memcached", cache: new MemcachedPrisma().client },
];
