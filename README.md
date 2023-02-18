# Cached Prisma

A Prisma client abstraction that simplifies caching.

## Status

| Source     | Shields                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------- |
| Project    | ![Release][release] ![License][license] ![Lines][lines] ![Languages][languages]                 |
| Health     | ![Docs][docs] ![Review][review]![Quality][quality] ![Coverage][coverage]                        |
| Publishers | ![Version][version] ![Downloads][downloads]                                                     |
| Repository | ![Issues][issues] ![Issues closed][issues_closed] ![Pulls][pulls] ![Pulls closed][pulls_closed] |
| Activity   | ![Contributors][contributors] ![Monthly commits][monthly_commits] ![Last commit][last_commit]   |

## Installation

```bash
npm i cached-prisma
```

## Usage

To implement a cache we need to divert the prisma client's internals so that we
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

The caching mechanism should be configurable. To control the object used for
cache storage you can extend the Prisma class:

```ts
import { LruCache } from "cached-prisma";

class CustomPrisma extends Prisma {
  static override cacheFactory = () => new LruCache(100);
}
```

## Minimal example

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
prisma generate
```

Migrate the database.

```bash
prisma migrate dev
```

Now we can create our client:

```ts
import { Prisma } from "cached-prisma";

const client = new Prisma().client;

client.user.create({ data: { name: "Joel" } });
```

## Advanced concepts

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
git clone https://github.com/JoelLefkowitz/cached-prisma.git
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

## Tests

To run tests:

```bash
nps test
```

## Documentation

This repository's documentation is hosted on [Read the Docs][readthedocs].

## Tooling

### Linters

To run linters:

```bash
nps lint
```

### Formatters

To run formatters:

```bash
nps format
```

## Continuous integration

This repository uses github actions to lint and test each commit. Formatting
tasks and writing/generating documentation must be done before committing new
code.

## Versioning

This repository adheres to semantic versioning standards. For more information
on semantic versioning visit [SemVer][semver].

Bump2version is used to version and tag changes. For example:

```bash
bump2version patch
```

## Changelog

Please read this repository's [changelog](CHANGELOG.md) for details on changes
that have been made.

## Contributing

Please read this repository's guidelines on [contributing](CONTRIBUTING.md) for
details on the process for submitting pull requests. Moreover, our
[code of conduct](CODE_OF_CONDUCT.md) declares our collaboration standards.

## Contributors

- **Joel Lefkowitz** - _Initial work_ - [Joel Lefkowitz][author]

[![Buy Me A Coffee][coffee_button]][coffee_author]

## Remarks

Lots of love to the open source community!

![Be kind][be_kind]

<!-- Links -->

[readthedocs]: https://cached-prisma.readthedocs.io/
[semver]: http://semver.org/
[author]: https://github.com/joellefkowitz
[coffee_author]: https://www.buymeacoffee.com/joellefkowitz
[coffee_button]: https://cdn.buymeacoffee.com/buttons/default-blue.png
[be_kind]: https://media.giphy.com/media/osAcIGTSyeovPq6Xph/giphy.gif

<!-- Project shields -->

[release]: https://img.shields.io/github/v/tag/joellefkowitz/cached-prisma
[license]: https://img.shields.io/github/license/joellefkowitz/cached-prisma
[lines]: https://img.shields.io/tokei/lines/github/joellefkowitz/cached-prisma
[languages]:
  https://img.shields.io/github/languages/count/joellefkowitz/cached-prisma

<!-- Health shields -->

[review]:
  https://img.shields.io/github/actions/workflow/status/JoelLefkowitz/cached-prisma/review.yml
[docs]: https://img.shields.io/readthedocs/cached-prisma
[quality]: https://img.shields.io/codacy/grade/00658bb866d6482184b86d16d3ce5ae8
[coverage]:
  https://img.shields.io/codacy/coverage/00658bb866d6482184b86d16d3ce5ae8

<!-- Publishers shields -->

[version]: https://img.shields.io/npm/v/cached-prisma
[downloads]: https://img.shields.io/npm/dw/cached-prisma

<!-- Repository shields -->

[issues]: https://img.shields.io/github/issues/joellefkowitz/cached-prisma
[issues_closed]:
  https://img.shields.io/github/issues-closed/joellefkowitz/cached-prisma
[pulls]: https://img.shields.io/github/issues-pr/joellefkowitz/cached-prisma
[pulls_closed]:
  https://img.shields.io/github/issues-pr-closed/joellefkowitz/cached-prisma

<!-- Activity shields -->

[contributors]:
  https://img.shields.io/github/contributors/joellefkowitz/cached-prisma
[monthly_commits]:
  https://img.shields.io/github/commit-activity/m/joellefkowitz/cached-prisma
[last_commit]:
  https://img.shields.io/github/last-commit/joellefkowitz/cached-prisma
