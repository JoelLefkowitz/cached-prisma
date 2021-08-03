import { LruCache } from '../caches/local';
import { Memcached } from '../caches/memcached';
import { Prisma } from './prisma';
import { expect } from 'chai';

const singletonClient = <T extends typeof Prisma>(cls: T) =>
  it('has a shared client instance.', () => {
    const client1 = new cls().client;
    const client2 = new cls().client;

    expect(client1).to.eql(client2);
  });

const singletonCache = <T extends typeof Prisma>(cls: T) =>
  it('has a shared cache instance.', () => {
    const cache1 = new cls().cache;
    const cache2 = new cls().cache;

    expect(cache1).to.eql(cache2);
  });

const cachesResults = <T extends typeof Prisma>(cls: T) =>
  it('caches results.', async () => {
    const prisma = new cls();

    const user = await prisma.client.user.create({ data: { name: 'test' } });
    await prisma.client.user.findFirst({ where: { id: user.id } });

    expect(
      prisma.cache.read(
        JSON.stringify({
          field: 'user',
          action: 'findFirst',
          args: [{ where: { id: user.id } }],
        })
      )
    ).to.equal(JSON.stringify(user));
  });

const flushesResults = <T extends typeof Prisma>(cls: T) =>
  it('flushes the cache after mutations.', async () => {
    const prisma = new cls();

    const user = await prisma.client.user.create({ data: { name: 'test' } });
    await prisma.client.user.findFirst({ where: { id: user.id } });
    await prisma.client.user.create({ data: { name: 'test' } });

    expect(
      prisma.cache.read(
        JSON.stringify({
          field: 'user',
          action: 'findFirst',
          args: [{ where: { id: user.id } }],
        })
      )
    ).to.be.null;
  });

const testCacheBehaviors = <T extends typeof Prisma>(name: string, cls: T) =>
  describe(name, () => {
    singletonClient(cls);
    singletonCache(cls);
    cachesResults(cls);
    flushesResults(cls);
  });

testCacheBehaviors('Prisma BaseClass', Prisma);

testCacheBehaviors(
  'Extensible with LruCache',
  class extends Prisma {
    cacheFactory = () => new LruCache(10);
  }
);

testCacheBehaviors(
  'Extensible with Memcached',
  class extends Prisma {
    cacheFactory = () => new Memcached('127.0.0.1:11211', 10);
  }
);
