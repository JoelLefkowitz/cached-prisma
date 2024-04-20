import { Cache, Memcached, Prisma } from "../../src";

export class MemcachedPrisma extends Prisma {
  static override cacheFactory = (): Cache =>
    new Memcached("127.0.0.1:11211", 10);
}
