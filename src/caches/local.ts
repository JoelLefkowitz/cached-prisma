// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./local.d.ts" />

import { Cache, Maybe } from "../main";

import LruMap from "collections/lru-map";

export type Serialized = { key: string; value: string };

export class LruCache implements Cache {
  private _map: LruMap;

  constructor(size: number) {
    this._map = new LruMap({}, size);
  }

  read = (key: string): Maybe<string> => this._map.get(key) || null;

  write = (key: string, value: string): LruMap => this._map.set(key, value);
}
