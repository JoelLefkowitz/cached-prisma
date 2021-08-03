export type Maybe<T> = T | null;

export interface Cache {
  read: (key: string) => Maybe<string>;
  write: (key: string, value: string) => void;
}

export interface AsyncCache {
  read: (key: string) => Promise<Maybe<string>>;
  write: (key: string, value: string) => Promise<void>;
}

export const IdempotentActions = [
  'findUnique',
  'findMany',
  'findFirst',
  'queryRaw',
  'aggregate',
  'count',
];
