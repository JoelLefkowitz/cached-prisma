import { Cache } from "../../models/Cache.model";
import LfuMap from "collections/lfu-map";

export class LfuCache implements Cache {
  private map: LfuMap;

  constructor(size: number = 1000) {
    this.map = new LfuMap({}, size);
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
