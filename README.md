# Cached Prisma

A Prisma client abstraction that simplifies caching.

![Review](https://img.shields.io/github/actions/workflow/status/JoelLefkowitz/cached-prisma/review.yml)
![Version](https://img.shields.io/npm/v/cached-prisma)
![Downloads](https://img.shields.io/npm/dw/cached-prisma)
![Size](https://img.shields.io/bundlephobia/min/cached-prisma)
![Quality](https://img.shields.io/codacy/grade/00658bb866d6482184b86d16d3ce5ae8)
![Coverage](https://img.shields.io/codacy/coverage/00658bb866d6482184b86d16d3ce5ae8)

```txt
.----------------------------.
|        Read x 1000         |
|----------------------------|
|      Cache      |  time/s  |
|-----------------|----------|
| Memcached       | 0.633634 |
| Hazelcast       | 0.571334 |
| Redis           | 0.621926 |
| LfuCache        | 0.828305 |
| LruCache        | 0.763399 |
| Without a cache | 1.059614 |
'----------------------------'
.----------------------------.
|  Read and overwrite x 100  |
|----------------------------|
|      Cache      |  time/s  |
|-----------------|----------|
| Memcached       | 0.346509 |
| Hazelcast       | 0.249805 |
| Redis           | 0.325970 |
| LfuCache        | 0.407265 |
| LruCache        | 0.392114 |
| Without a cache | 0.222564 |
'----------------------------'
```

## Installing

```bash
npm install cached-prisma
```

## Documentation

Documentation and more detailed examples are hosted on [Github Pages](https://joellefkowitz.github.io/cached-prisma).

## Usage

```ts
import { Prisma } from "cached-prisma";

const client = new Prisma().client;

client.user.create({ data: { name: "Joel" } });

// This populates the cache
client.user.findFirst({ where: { name: "Joel" } });

// This is retrieved from the cache
client.user.findFirst({ where: { name: "Joel" } });
```

To control the object used for cache storage you can extend the `Prisma` class:

```ts
import { LruCache } from "cached-prisma";

class LruCachePrisma extends Prisma {
  static override cacheFactory = () => new LruCache(1000);
}
```

Caches are also provided for `Memcached`, `Redis`, and `Hazelcast`.

### Minimal example

Create a prisma schema:

```prisma
datasource db {
  url      = env("DATABASE_URL")
  provider = "postgresql"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id   Int    @id @default(autoincrement())
  name String
}
```

Create a database. In this example we create a postgres container. You can
switch the db, user and password for your environment.

```bash
docker run --rm -d              \
  -p 5432:5432                  \
  -e POSTGRES_DB=db             \
  -e POSTGRES_USER=user         \
  -e POSTGRES_PASSWORD=password \
  postgres
```

Define the DATABASE_URL environment variable mentioned in our prisma schema:

```bash
export DATABASE_URL=postgresql://user:password@localhost:5432/db
```

Generate the types for your client:

```bash
npx prisma generate
```

Migrate the database:

```bash
npx prisma migrate dev
```

Now we can create our client:

```ts
import { Prisma } from "cached-prisma";

const client = new Prisma().client;

client.user.create({ data: { name: "Joel" } });
```

## Caches

### LruCache

```ts
import { LruCache } from "cached-prisma";

class LruCachePrisma extends Prisma {
  static override cacheFactory = () => new LruCache(1000);
}
```

### LfuCache

```ts
import { LfuCache } from "cached-prisma";

class LfuCachePrisma extends Prisma {
  static override cacheFactory = () => new LfuCache(1000);
}
```

### Memcached

```ts
import { Memcached } from "cached-prisma";

class MemcachedPrisma extends Prisma {
  static override cacheFactory = () => new Memcached("127.0.0.1", 11211, 10);
}
```

### Redis

```ts
import { Redis } from "cached-prisma";

class RedisPrisma extends Prisma {
  static override cacheFactory = () => new Redis("127.0.0.1", 6379, 10);
}
```

### Hazelcast

```ts
import { Hazelcast } from "cached-prisma";

class HazelcastPrisma extends Prisma {
  static override cacheFactory = () => new Hazelcast("127.0.0.1", 5701, 10);
}
```

## Design

To implement the cache we need to divert the prisma client's internals so that we can return cached values without hitting the database. To do this we can use a singleton instance for the client and cache objects.

```ts
import { Prisma } from "cached-prisma";

const client1 = new Prisma().client;
const client2 = new Prisma().client;

// These point to the same object
client1 === client2;
```

```ts
import { Prisma } from "cached-prisma";

const cache1 = new Prisma().cache;
const cache2 = new Prisma().cache;

// These point to the same object
cache1 === cache2;
```

### Actions

Caches implement safe read and write methods:

```ts
export interface Cache {
  read: (key: string) => Promise<Maybe<string>>;
  write: (key: string, value: string) => Promise<void>;
  flush: () => Promise<void>;
}
```

We cache the following methods which do not mutate state:

- `findUnique`
- `findMany`
- `findFirst`
- `queryRaw`
- `aggregate`
- `count`

After any of the following state mutating methods we flush the cache:

- `create`
- `createMany`
- `delete`
- `deleteMany`
- `executeRaw`
- `update`
- `updateMany`
- `upsert`

## Tooling

### Dependencies

To install dependencies:

```bash
yarn install
```

### Tests

To run tests:

Create a test database:

```bash
docker run --rm -d              \
  -p 5432:5432                  \
  -e POSTGRES_DB=db             \
  -e POSTGRES_USER=user         \
  -e POSTGRES_PASSWORD=password \
  postgres
```

Create test cache providers:

```bash
docker run --rm -d -p 11211:11211 memcached
docker run --rm -d -p 6379:6379 redis
docker run --rm -d -p 5701:5701 hazelcast/hazelcast
```

Apply the database migrations:

```bash
export DATABASE_URL=postgresql://user:password@localhost:5432/db
yarn prisma generate --schema ./test/schema.prisma
yarn prisma migrate dev --schema ./test/schema.prisma
```

```bash
yarn test
```

### Documentation

To generate the documentation locally:

```bash
yarn docs
```

### Linters

To run linters:

```bash
yarn lint
```

### Formatters

To run formatters:

```bash
yarn format
```

## Contributing

Please read this repository's [Code of Conduct](CODE_OF_CONDUCT.md) which outlines our collaboration standards and the [Changelog](CHANGELOG.md) for details on breaking changes that have been made.

This repository adheres to semantic versioning standards. For more information on semantic versioning visit [SemVer](https://semver.org).

Bump2version is used to version and tag changes. For example:

```bash
bump2version patch
```

### Contributors

- [Joel Lefkowitz](https://github.com/joellefkowitz) - Initial work

## Remarks

Lots of love to the open source community!

<div align='center'>
    <img width=200 height=200 src='https://media.giphy.com/media/osAcIGTSyeovPq6Xph/giphy.gif' alt='Be kind to your mind' />
    <img width=200 height=200 src='https://media.giphy.com/media/KEAAbQ5clGWJwuJuZB/giphy.gif' alt='Love each other' />
    <img width=200 height=200 src='https://media.giphy.com/media/WRWykrFkxJA6JJuTvc/giphy.gif' alt="It's ok to have a bad day" />
</div>
