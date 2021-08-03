import { LruCache, Memcached, Prisma } from '../src/main';

import { PrismaClient } from '.prisma/client';

async function profile(
  client: PrismaClient,
  work: (client: PrismaClient) => Promise<void>,
  cycles: number
): Promise<number> {
  const time = process.hrtime();

  for (let i = 0; i < cycles; i++) {
    await work(client);
  }

  const hrtime = process.hrtime(time);
  return hrtime[0] + hrtime[1] / 10 ** 9;
}

const read = (id: number) => async (client: PrismaClient) => {
  await client.user.findFirst({ where: { id } });
};

const readWrite =
  (id: number, name: string) => async (client: PrismaClient) => {
    await client.user.findFirst({ where: { id } });
    await client.user.create({ data: { name } });
  };

export const run = async (cycles: number): Promise<void> => {
  class LruCachedPrisma extends Prisma {
    cacheFactory = () => new LruCache(10);
  }

  class MemcachedPrisma extends Prisma {
    cacheFactory = () => new Memcached('127.0.0.1:11211', 10);
  }

  const standard = new PrismaClient();
  const lruCached = new LruCachedPrisma().client;
  const memcached = new MemcachedPrisma().client;

  console.log(`${cycles} prisma reads:`);
  console.table([
    ['Without cache', await profile(standard, read(1), cycles)],
    ['LruMap cache', await profile(lruCached, read(1), cycles)],
    ['Memcached', await profile(memcached, read(1), cycles)],
  ]);

  console.log(`${cycles} prisma read and writes:`);
  console.table([
    ['Without cache', await profile(standard, readWrite(1, 'test'), cycles)],
    ['LruMap cache', await profile(lruCached, readWrite(1, 'test'), cycles)],
    ['Memcached', await profile(memcached, readWrite(1, 'test'), cycles)],
  ]);
};

if (typeof require !== 'undefined' && require.main === module) {
  run(1000);
}
