# Cached Prisma

A Prisma client abstraction that simplifies caching.

## Status

| Source     | Shields                                                                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Project    | ![release][release_shield] ![license][license_shield] ![lines][lines_shield] ![languages][languages_shield]                                  |
| Health     | ![readthedocs][readthedocs_shield] ![github_review][github_review_shield]![codacy][codacy_shield] ![codacy_coverage][codacy_coverage_shield] |
| Publishers | ![npm][npm_shield] ![npm_downloads][npm_downloads_shield]                                                                                    |
| Repository | ![issues][issues_shield] ![issues_closed][issues_closed_shield] ![pulls][pulls_shield] ![pulls_closed][pulls_closed_shield]                  |
| Activity   | ![contributors][contributors_shield] ![monthly_commits][monthly_commits_shield] ![last_commit][last_commit_shield]                           |

## Installing

```bash
npm i cached-prisma
```

## Usage

To implement a cache we need to divert the prisma client's internals so that we can return cached values without hitting the database. To do this we can use readonly singleton instances for the client and cache objects.

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

The caching mechanism should be configurable. To control the object used for cache storage you can extend the Prisma class:

```ts
import { LruCache } from "cached-prisma";

class CustomPrisma extends Prisma {
  cacheFactory = () => new LruCache(100);
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

Create a database. In this example we create a postgres container. You can switch db, user and password for your environment.

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

The default cache is a fixed size queue that pops values as it surpasses its maximum length.

```ts
import LruMap from "collections/lru-map";

new LruCache(100);
```

Memcached support is provided out of the box:

```ts
import { Memcached } from "cached-prisma";

class CustomPrisma extends Prisma {
  cacheFactory = () => new Memcached("127.0.0.1:11211", 10);
}
```

The second parameter to the Memcached constructor is the storage lifetime of each write in seconds.

Caches implement safe read and write methods:

```ts
export type Maybe<T> = T | null;

export interface Cache {
  read: (key: string) => Maybe<string>;
  write: (key: string, value: string) => void;
}

export interface AsyncCache {
  read: (key: string) => Promise<Maybe<string>>;
  write: (key: string, value: string) => Promise<void>;
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
grunt database
grunt caches
```

## Tests

To run tests:

```bash
grunt test
```

## Profiling

Local performance profilers are included as a sanity check:

```bash
grunt profile
```

```bash
1000 read calls:
┌───────────────┬─────────────┐
│    (index)    │   time /s   │
├───────────────┼─────────────┤
│ Without cache │ 2.778027378 │
│ LruMap cache  │ 0.106343917 │
│   Memcached   │ 0.136733023 │
└───────────────┴─────────────┘

1000 read and write calls:
┌───────────────┬────────-─────┐
│    (index)    │   time /s    │
├───────────────┼──────────────┤
│ Without cache │ 11.241554884 │
│ LruMap cache  │ 18.793905985 │
│   Memcached   │ 18.799760361 │
└───────────────┴──────────────┘
```

## Documentation

This repository's documentation is hosted on [readthedocs][readthedocs].

## Tooling

To run linters:

```bash
grunt lint
```

To run formatters:

```bash
grunt format
```

## Continuous integration

This repository uses github actions to lint and test each commit. Formatting tasks and writing/generating documentation must be done before committing new code.

## Versioning

This repository adheres to semantic versioning standards.
For more information on semantic versioning visit [SemVer][semver].

Bump2version is used to version and tag changes.
For example:

```bash
bump2version patch
```

## Changelog

Please read this repository's [changelog](CHANGELOG.md) for details on changes that have been made.

## Contributing

Please read this repository's guidelines on [contributing](CONTRIBUTING.md) for details on the process for submitting pull requests. Moreover, our [code of conduct](CODE_OF_CONDUCT.md) declares our collaboration standards.

## Contributors

- **Joel Lefkowitz** - _Initial work_ - [Joel Lefkowitz][author]

[![Buy Me A Coffee][coffee_button]][author_coffee]

## Remarks

Lots of love to the open source community!

![Be kind][be_kind]

<!-- Project links -->

[readthedocs]: https://cached-prisma.readthedocs.io/en/latest/

<!-- External links -->

[semver]: http://semver.org/
[be_kind]: https://media.giphy.com/media/osAcIGTSyeovPq6Xph/giphy.gif

<!-- Contributor links -->

[author]: https://github.com/joellefkowitz
[author_coffee]: https://www.buymeacoffee.com/joellefkowitz
[coffee_button]: https://cdn.buymeacoffee.com/buttons/default-blue.png

<!-- Project shields -->

[release_shield]: https://img.shields.io/github/v/tag/joellefkowitz/cached-prisma
[license_shield]: https://img.shields.io/github/license/joellefkowitz/cached-prisma
[lines_shield]: https://img.shields.io/tokei/lines/github/joellefkowitz/cached-prisma
[languages_shield]: https://img.shields.io/github/languages/count/joellefkowitz/cached-prisma

<!-- Health shields -->

[readthedocs_shield]: https://img.shields.io/readthedocs/cached-prisma
[github_review_shield]: https://img.shields.io/github/workflow/status/JoelLefkowitz/cached-prisma/Review
[codacy_shield]: https://img.shields.io/codacy/grade/00658bb866d6482184b86d16d3ce5ae8
[codacy_coverage_shield]: https://img.shields.io/codacy/coverage/00658bb866d6482184b86d16d3ce5ae8

<!-- Publishers shields -->

[npm_shield]: https://img.shields.io/npm/v/cached-prisma
[npm_downloads_shield]: https://img.shields.io/npm/dw/cached-prisma

<!-- Repository shields -->

[issues_shield]: https://img.shields.io/github/issues/joellefkowitz/cached-prisma
[issues_closed_shield]: https://img.shields.io/github/issues-closed/joellefkowitz/cached-prisma
[pulls_shield]: https://img.shields.io/github/issues-pr/joellefkowitz/cached-prisma
[pulls_closed_shield]: https://img.shields.io/github/issues-pr-closed/joellefkowitz/cached-prisma

<!-- Activity shields -->

[contributors_shield]: https://img.shields.io/github/contributors/joellefkowitz/cached-prisma
[monthly_commits_shield]: https://img.shields.io/github/commit-activity/m/joellefkowitz/cached-prisma
[last_commit_shield]: https://img.shields.io/github/last-commit/joellefkowitz/cached-prisma
