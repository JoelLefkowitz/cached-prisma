import { Cache } from "./Prisma";
import IORedis from "ioredis";

export type RedisParams = {
  cacheKeyPrefix?: string;
  lifetime: number;
  redisOptions?: IORedis.RedisOptions;
  redisClient?: IORedis.Redis;
};

export class Redis implements Cache {
  private client: IORedis.Redis;
  private lifetime: number;
  private cacheKeyPrefix: string | undefined;
  private logger: Console | undefined;

  constructor({
    cacheKeyPrefix,
    lifetime,
    redisOptions,
    redisClient,
  }: RedisParams) {
    if (redisClient) {
      this.client = redisClient;
    } else if (redisOptions) {
      this.client = new IORedis.Redis(redisOptions);
    } else {
      throw new Error("redisOptions or redisClient must be provided");
    }
    this.lifetime = lifetime;
    this.cacheKeyPrefix = cacheKeyPrefix;
    if (this.cacheKeyPrefix) {
      this.logger?.warn("Redis cache key prefix:", this.cacheKeyPrefix);
    }
  }

  async read(key: string): Promise<string | null> {
    const redisKey = this.cacheKeyPrefix
      ? `${this.cacheKeyPrefix}:${key}`
      : key;
    const data = await this.client.get(redisKey);
    return data ?? null;
  }

  async write(key: string, value: string): Promise<void> {
    const redisKey = this.cacheKeyPrefix
      ? `${this.cacheKeyPrefix}:${key}`
      : key;

    await this.client.set(redisKey, value, "EX", this.lifetime);
  }

  async deleteKeys(pattern: string): Promise<void> {}

  async flush(): Promise<void> {
    if (this.cacheKeyPrefix) {
      await this.deleteKeys(`${this.cacheKeyPrefix}*`);
    } else {
      await this.client.flushdb();
    }
  }
}
