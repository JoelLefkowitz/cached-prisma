declare module 'collections/lru-map' {
  class LruMap {
    constructor(values: Record<string, string>, maxLength: number);

    get<T>(key: string, defaultValue?: T): T;
    set<T>(key: string, defaultValue?: T): LruMap;
  }

  export default LruMap;
}
