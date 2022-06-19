import { AsyncCache, Maybe } from "../main";
import { createClient } from "redis";
import { RedisClientType } from "@redis/client";

export class Redis implements AsyncCache {
  private _client: RedisClientType;
  private _lifetime: number;

  constructor(address = "redis://127.0.0.0:6379", lifetime = 10) {
    this._client = createClient({
      url: address,
    });
    this._lifetime = lifetime;
    this._client.connect();
  }

  read = (key: string): Promise<Maybe<string>> => this._client.get(key);

  write = (key: string, value: string): Promise<void> => {
    return new Promise((resolve) => {
      this._client
        .set(key, value, {
          EX: this._lifetime,
        })
        .then(() => {
          resolve();
        });
    });
  };
}
