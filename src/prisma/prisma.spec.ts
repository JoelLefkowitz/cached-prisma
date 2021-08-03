import { LruMap } from 'collections/lru-map';
import { Maybe } from '../types';
import { Prisma } from './prisma';
import { expect } from 'chai';

describe('Prisma', () => {
  it('is a singleton.', () => {
    const client1 = new Prisma().client;
    const client2 = new Prisma().client;

    expect(client1).to.eql(client2);
  });

  it('caches results.', async () => {
    // Implement a public cache that we can inspect.
    const cache = new LruMap({}, 10);
    cache.read = (key: string): Maybe<string> => cache.get(key) || null;
    cache.write = (key: string, value: string): void => cache.set(key, value);

    Prisma.flushCache();
    class CustomPrisma extends Prisma {
      cacheFactory = () => cache;
    }

    const client = new CustomPrisma().client;
    const user = await client.user.create({ data: { name: 'test' } });

    const result = await client.user.findFirst({
      where: { id: user.id, name: 'test' },
    });

    await client.user.findFirst({ where: { id: user.id, name: 'test' } });

    const key = JSON.stringify({
      field: 'user',
      action: 'findFirst',
      args: [{ where: { id: user.id, name: 'test' } }],
    });

    expect(cache.get(key)).to.equal(result);
  });
});
