import { Cache } from "../../models/Cache.model";
import MemcachedClient from "memcached";

export class Memcached implements Cache {
  readonly lifetime: number;

  private client: MemcachedClient;

  constructor(
    host = "0.0.0.0",
    port = 11211,
    lifetime = 10,
    options: MemcachedClient.options = {},
  ) {
    this.client = new MemcachedClient([host, port].join(":"), options);
    this.lifetime = lifetime;
  }

  async read(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err: string, data: string | null) => {
        if (err) {
          reject(new Error(err));
        } else {
          resolve(data ?? null);
        }
      });
    });
  }

  async write(key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, this.lifetime, (err: string) => {
        if (err) {
          reject(new Error(err));
        } else {
          resolve();
        }
      });
    });
  }

  async flush(): Promise<void> {
    return new Promise((resolve) => {
      this.client.flush(() => {
        resolve();
      });
    });
  }

  close(): void {
    this.client.end();
  }
}
