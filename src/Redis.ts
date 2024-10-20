import { Cache } from "./Prisma";
import { Redis as RedisClient } from "ioredis";

export class Redis implements Cache {
  readonly lifetime: number;

  private client: RedisClient;

  constructor(host = "0.0.0.0", port = 6379, lifetime = 10, prefix = "cache") {
    this.client = new RedisClient(port, host, { keyPrefix: prefix });
    this.lifetime = lifetime;
  }

  read(key: string): Promise<string | null> {
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
