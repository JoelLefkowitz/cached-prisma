import {
  Cache,
  Hazelcast,
  LfuCache,
  LruCache,
  Memcached,
  Redis,
} from "../../src";

export const caches: Record<string, new () => Cache> = {
  LruCache,
  LfuCache,
  Memcached,
  Redis,
  Hazelcast,
};
