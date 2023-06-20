/* eslint-disable no-useless-catch */
import * as IORedis from "ioredis";
import { Cache } from "./prisma";

export class Redis implements Cache {
  private client: IORedis.Redis;
  private lifetime: number;

  constructor(address = "127.0.0.0:6379", lifetime = 10, redisOptions = {}) {
    this.client = new IORedis.Redis(address, redisOptions);
    this.lifetime = lifetime;
  }

  async read(key: string): Promise<string | null> {
    try {
      const data = await this.client.get(key);
      return data ?? null;
    } catch (err) {
      throw err;
    }
  }

  async write(key: string, value: string): Promise<void> {
    try {
      await this.client.set(key, value, "EX", this.lifetime);
    } catch (err) {
      throw err;
    }
  }

  async flush(): Promise<void> {
    try {
      await this.client.flushdb();
    } catch (err) {
      throw err;
    }
  }
}
