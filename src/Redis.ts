import { Cache } from "./Prisma";
import { Redis as RedisClient, RedisOptions } from "ioredis";

export class Redis implements Cache {
  readonly lifetime: number;

  private client: RedisClient;

  constructor(
    hostOrRedisClient: string | RedisClient = "0.0.0.0",
    portOrOptions: number | RedisOptions = 6379,
    lifetimeSeconds = 60,
    prefix = "cache"
  ) {
    if (typeof hostOrRedisClient === "string") {
      if (typeof portOrOptions === "number") {
        this.client = new RedisClient(portOrOptions, hostOrRedisClient, { keyPrefix: prefix });
      } else {
        this.client = new RedisClient(hostOrRedisClient, portOrOptions);
      }
    } else {
      this.client = hostOrRedisClient;
    }

    this.lifetime = lifetimeSeconds;
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
