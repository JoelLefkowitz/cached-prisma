import { Memcached, Prisma } from "../../src";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { PrismaClient } from "@prisma/client";
import { RedisPrisma } from "./RedisPrisma";
const redisPrisma = new RedisPrisma();

export const caches = [
  { name: "Without cache", cache: new PrismaClient() },
  { name: "LruMap cache", cache: new Prisma().client },
  { name: "Memcached", cache: new Memcached() },
  { name: "Redis cache", cache: redisPrisma.client },
];
