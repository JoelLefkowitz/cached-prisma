import { Cache, Maybe } from '../types';

import LruMap from 'collections/lru-map';

export type Serialized = { key: string; value: string };

export class LruCache implements Cache {
  private _map: LruMap;

  constructor(size: number) {
    this._map = new LruMap({}, size);
  }

  read = (key: string): Maybe<string> => this._map.get(key) || null;

  write = (key: string, value: string): void => this._map.set(key, value);
}
