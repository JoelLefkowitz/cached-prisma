import { Cache } from "./Prisma";
import LruMap from "collections/lru-map";

export type Serialized = { key: string; value: string };

export class LruCache implements Cache {
  private map: LruMap;

  constructor(size: number) {
    this.map = new LruMap({}, size);
  }

  read(key: string): Promise<string | null> {
    return Promise.resolve(this.map.get(key) ?? null);
  }

  write(key: string, value: string): Promise<void> {
    this.map.set(key, value);
    return Promise.resolve();
  }

  flush(): Promise<void> {
    this.map.clear();
    return Promise.resolve();
  }
}
