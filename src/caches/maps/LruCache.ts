import { Cache } from "../../models/Cache.model";
import LruMap from "collections/lru-map";

export class LruCache implements Cache {
  private map: LruMap;

  constructor(size: number) {
    this.map = new LruMap({}, size);
  }

  async read(key: string): Promise<string | null> {
    return this.map.get(key) ?? null;
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
