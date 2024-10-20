import { Cache } from "./prisma";
import MemcachedClient from "memcached";

export class Memcached implements Cache {
  private client: MemcachedClient;
  private lifetime: number;

  constructor(address = "127.0.0.0:11211", lifetime = 10) {
    this.client = new MemcachedClient(address);
    this.lifetime = lifetime;
  }

  read(key: string): Promise<string | null> {
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

  write(key: string, value: string): Promise<void> {
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

  flush(): Promise<void> {
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
