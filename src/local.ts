import { Cache, Maybe } from './prisma';

export type Serialized = { key: string; value: string };

export class FixedTuple implements Cache {
  private _size: number;
  private _array: Serialized[];

  constructor(size: number) {
    this._size = size;
    this._array = [];
  }

  read = (key: string): Maybe<string> =>
    this._array.filter((i: Serialized) => i.key == key).pop()?.value || null;

  write = (key: string, value: string): void => {
    this._array.unshift({ key, value });

    if (this._array.length > this._size) {
      this._array.pop();
    }
  };
}
