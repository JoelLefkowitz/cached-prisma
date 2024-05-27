# Cached Prisma

A Prisma client abstraction that simplifies caching.

![Review](https://img.shields.io/github/actions/workflow/status/JoelLefkowitz/cached-prisma/review.yml)
![Version](https://img.shields.io/npm/v/cached-prisma)
![Downloads](https://img.shields.io/npm/dw/cached-prisma)
![Size](https://img.shields.io/bundlephobia/min/cached-prisma)
![Quality](https://img.shields.io/codacy/grade/00658bb866d6482184b86d16d3ce5ae8)
![Coverage](https://img.shields.io/codacy/coverage/00658bb866d6482184b86d16d3ce5ae8)

## Installing

```bash
npm install cached-prisma
```

## Documentation

Documentation and more detailed examples are hosted on [Github Pages](https://joellefkowitz.github.io/cached-prisma).

## Usage

```ts
client.user.create({ data: { name: "Joel" } });

// This populates the cache
client.user.findFirst({ where: { name: "Joel" } });

// This is retrieved from the cache
client.user.findFirst({ where: { name: "Joel" } });
```

To control the object used for cache storage you can extend the Prisma class:

```ts
import { LruCache } from "cached-prisma";

class CustomPrisma extends Prisma {
  static override cacheFactory = () => new LruCache(100);
}
```

To implement the cache we need to divert the prisma client's internals so that we
can return cached values without hitting the database. To do this we can use a
singleton instance for the client and cache objects.

```ts
import { Prisma } from "cached-prisma";

const client1 = new Prisma().client;
const client2 = new Prisma().client;

client1 === client2;
```

```ts
import { Prisma } from "cached-prisma";

const cache1 = new Prisma().cache;
const cache2 = new Prisma().cache;

cache1 === cache2;
```

### Minimal example

Create a prisma schema.

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
switch db, user and password for your environment.

```bash
docker run --rm -d              \
  -p 5432:5432                  \
  -e POSTGRES_DB=db             \
  -e POSTGRES_USER=user         \
  -e POSTGRES_PASSWORD=password \
  postgres:13
```

Define the DATABASE_URL environment variable mentioned in our prisma schema.

```bash
export DATABASE_URL=postgresql://user:password@localhost:5432/db
```

Generate the types for your client.

```bash
npx prisma generate
```

Migrate the database.

```bash
npx prisma migrate dev
```

Now we can create our client:

```ts
import { Prisma } from "cached-prisma";

const client = new Prisma().client;

client.user.create({ data: { name: "Joel" } });
```

## Discussion

The default cache is a fixed size queue that pops values as it surpasses its
maximum length.

```ts
import LruMap from "collections/lru-map";

new LruCache(100);
```

Memcached support is provided out of the box:

```ts
import { Memcached } from "cached-prisma";

class CustomPrisma extends Prisma {
  static override cacheFactory = () => new Memcached("127.0.0.1:11211", 10);
}
```

The second parameter to the Memcached constructor is the storage lifetime of
each write in seconds.

Caches implement safe read and write methods:

```ts
export interface Cache {
  read: (key: string) => Promise<Maybe<string>>;
  write: (key: string, value: string) => Promise<void>;
  flush: () => Promise<void>;
}
```

We cache the following methods which do not mutate state:

- findUnique
- findMany
- findFirst
- queryRaw
- aggregate
- count

After any of the following state mutating methods we flush the cache:

- create
- createMany
- delete
- deleteMany
- executeRaw
- update
- updateMany
- upsert

## Running locally

```bash
git clone https://github.com/joellefkowitz/cached-prisma.git
```

To start up a postgres and memcached container:

```bash
docker run --rm -d              \
  -p 5432:5432                  \
  -e POSTGRES_DB=db             \
  -e POSTGRES_USER=user         \
  -e POSTGRES_PASSWORD=password \
  postgres:13

docker run -d --rm -p 11211:11211 memcached:1.6.9
```

```bash
npx prisma migrate dev --schema ./test/prisma/schema.prisma
```

## Tooling

### Dependencies

To install dependencies:

```bash
yarn install
```

### Tests

To run tests:

```bash
npm run test
```

### Documentation

To generate the documentation locally:

```bash
npm run docs
```

### Linters

To run linters:

```bash
npm run lint
```

### Formatters

To run formatters:

```bash
npm run format
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
