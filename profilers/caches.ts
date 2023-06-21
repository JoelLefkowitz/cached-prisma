import { MemcachedPrisma } from "./MemcachedPrisma";
import { Prisma } from "../src";
import { PrismaClient } from ".prisma/client";
import { RedisPrisma } from "./RedisPrisma";
const redisPrisma = new RedisPrisma();

export const caches = [
  { name: "Without cache", cache: new PrismaClient() },
  { name: "LruMap cache", cache: new Prisma().client },
  { name: "Memcached", cache: new MemcachedPrisma().client },
  { name: "Redis cache", cache: redisPrisma.client },
];
