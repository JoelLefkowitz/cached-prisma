import { AsyncCache, Maybe } from "../main";

import MemcachedClient from "memcached";

export class Memcached implements AsyncCache {
  private _client: MemcachedClient;
  private _lifetime: number;

  constructor(address = "127.0.0.0:11211", lifetime = 10) {
    this._client = new MemcachedClient(address);
    this._lifetime = lifetime;
  }

  read = (key: string): Promise<Maybe<string>> =>
    new Promise((resolve) =>
      this._client.get(key, (err: string, data: string) => {
        if (err) throw new Error(err);
        resolve(data || null);
      })
    );

  write = (key: string, value: string): Promise<void> =>
    new Promise((resolve) =>
      this._client.set(key, value, this._lifetime, (err: string) => {
        if (err) throw new Error(err);
        resolve();
      })
    );
}
