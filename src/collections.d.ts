declare module "collections/lfu-map" {
  class LfuMap {
    constructor(values: Record<string, string>, maxLength: number);

    get<T>(key: string, fallback?: T): T;
    set<T>(key: string, value?: T): void;
    clear(): void;
  }

  export default LfuMap;
}

declare module "collections/lru-map" {
  class LruMap {
    constructor(values: Record<string, string>, maxLength: number);

    get<T>(key: string, fallback?: T): T;
    set<T>(key: string, value?: T): void;
    clear(): void;
  }

  export default LruMap;
}
