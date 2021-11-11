declare module 'collections/lru-map' {
  class LruMap {
    constructor(
      values: any,
      maxLength: any,
      equals?: any,
      hash?: any,
      getDefault?: any
    );

    get<T>(key: any, defaultValue?: T): T;
    set<T>(key: any, defaultValue?: T): LruMap;
  }

  export default LruMap;
}
