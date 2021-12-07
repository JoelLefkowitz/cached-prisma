export { Prisma } from "./prisma/prisma";
export { LruCache } from "./caches/local";
export { Memcached } from "./caches/memcached";

export type Maybe<T> = T | null;

export interface Cache {
  read: (key: string) => Maybe<string>;
  write: (key: string, value: string) => void;
}

export interface AsyncCache {
  read: (key: string) => Promise<Maybe<string>>;
  write: (key: string, value: string) => Promise<void>;
}

export const PureActions = [
  "aggregate",
  "count",
  "findFirst",
  "findMany",
  "findUnique",
  "queryRaw",
];

export const ImpureActions = [
  "create",
  "createMany",
  "delete",
  "deleteMany",
  "executeRaw",
  "update",
  "updateMany",
  "upsert",
];
