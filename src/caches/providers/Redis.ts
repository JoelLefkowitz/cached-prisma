import { Cache } from "../../models/Cache.model";
import { Redis as RedisClient, RedisOptions } from "ioredis";

export class Redis implements Cache {
  readonly lifetime: number;

  private client: RedisClient;

  constructor(
    host = "0.0.0.0",
    port = 6379,
    lifetime = 10,
    prefix = "cache",
    options: RedisOptions = {},
  ) {
    this.client = new RedisClient(port, host, {
      keyPrefix: prefix,
      ...options,
    });

    this.lifetime = lifetime;
  }

  async read(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async write(key: string, value: string): Promise<void> {
    await this.client.set(key, value, "EX", this.lifetime);
  }

  async flush(): Promise<void> {
    await this.client.flushdb();
  }

  close(): void {
    this.client.disconnect();
  }
}
