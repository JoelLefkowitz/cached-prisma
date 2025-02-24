import {
  Hazelcast,
  LfuCache,
  LruCache,
  Memcached,
  Prisma,
  Redis,
} from "../src";
import { PrismaClient } from ".prisma/client";

export const caches = Object.entries({
  Memcached,
  Hazelcast,
  Redis,
  LfuCache,
  LruCache,
})
  .map(([name, factory]) => {
    Prisma.cacheFactory = () => new factory();
    return { name, cache: new Prisma().client };
  })
  .concat({
    name: "Without a cache",
    cache: new PrismaClient(),
  });
