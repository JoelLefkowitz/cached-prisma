import { Cache, Prisma, Redis } from "../../src";
const logger = console;

export class RedisPrisma extends Prisma {
  static override cacheFactory = (): Cache =>
    new Redis({
      lifetime: 10,
      redisOptions: { host: "127.0.0.1", port: 6379 },
      cacheKeyPrefix: "dbcache",
      logger,
    });
}
