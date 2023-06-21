/* eslint-disable no-useless-catch */
import * as IORedis from "ioredis";
import { Cache } from "./prisma";

export type RedisParams = {
  cacheKeyPrefix?: string;
  lifetime: number;
  redisOptions?: IORedis.RedisOptions;
  redisClient?: IORedis.Redis;
  logger?: Console;
};

const luaScript = `
local keys = redis.call('keys', ARGV[1])
for i=1,#keys,5000 do
    redis.call('del', unpack(keys, i, math.min(i+4999, #keys)))
end
return keys
`;

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
    logger,
  }: RedisParams) {
    this.logger = logger;

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
    try {
      const redisKey = this.cacheKeyPrefix
        ? `${this.cacheKeyPrefix}:${key}`
        : key;
      const data = await this.client.get(redisKey);
      return data ?? null;
    } catch (err) {
      throw err;
    }
  }

  async write(key: string, value: string): Promise<void> {
    try {
      const redisKey = this.cacheKeyPrefix
        ? `${this.cacheKeyPrefix}:${key}`
        : key;

      await this.client.set(redisKey, value, "EX", this.lifetime);
    } catch (err) {
      throw err;
    }
  }

  async deleteKeys(pattern: string): Promise<void> {
    const keys = await this.client.eval(luaScript, 0, pattern);
    console.log("Deleted keys:", keys);
  }

  async flush(): Promise<void> {
    try {
      if (this.cacheKeyPrefix) {
        await this.deleteKeys(`${this.cacheKeyPrefix}*`);
      } else {
        await this.client.flushdb();
      }
    } catch (err) {
      throw err;
    }
  }
}
