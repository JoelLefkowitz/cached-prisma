# Cached Prisma

A Prisma client abstraction that simplifies caching.

## Status

| Source     | Shields                                                                |
| ---------- | ---------------------------------------------------------------------- |
| Project    | ![latest_release] ![license] ![line_count] ![language_count]           |
| Health     | ![documentation] ![review_action] ![codacy_quality] ![codacy_coverage] |
| Publishers | ![npm_version] ![npm_downloads]                                        |
| Repository | ![open_issues] ![closed_issues] ![open_pulls] ![closed_pulls]          |
| Activity   | ![contributors] ![monthly_commits] ![last_commit]                      |

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

## Further reading

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

## Tests

To run tests:

```bash
nps test
```

## Documentation

This repository's documentation is hosted on [Read the Docs](https://cached-prisma.readthedocs.io/en/latest).

To generate the documentation locally:

```bash
quickdocs
```

## Linters

To run linters:

```bash
nps lint
```

## Formatters

To run formatters:

```bash
nps format
```

## Continuous integration

This repository uses GitHub Actions to lint and test each commit. Each commit should be formatted and its corresponding documentation should be updated.

## Versioning

This repository adheres to semantic versioning standards. For more information on semantic versioning visit [semver](https://semver.org).

Bump2version is used to version and tag changes. For example:

```bash
bump2version patch
```

## Changelog

Please read this repository's [changelog](CHANGELOG.md) for details on changes that have been made.

## Contributing

Please read this repository's guidelines on [contributing](CONTRIBUTING.md) for details on the process for submitting pull requests. Moreover, our [code of conduct](CODE_OF_CONDUCT.md) declares our collaboration standards.

## Contributors

- [Joel Lefkowitz](https://github.com/joellefkowitz) - Initial work

## Remarks

Lots of love to the open source community!

<p align='center'>
    <img width=200 height=200 src='https://media.giphy.com/media/osAcIGTSyeovPq6Xph/giphy.gif' alt='Be kind to your mind' />
    <img width=200 height=200 src='https://media.giphy.com/media/KEAAbQ5clGWJwuJuZB/giphy.gif' alt='Love each other' />
    <img width=200 height=200 src='https://media.giphy.com/media/WRWykrFkxJA6JJuTvc/giphy.gif' alt="It's ok to have a bad day" />
</p>

[latest_release]: https://img.shields.io/github/v/tag/joellefkowitz/cached-prisma "Latest release"
[license]: https://img.shields.io/github/license/joellefkowitz/cached-prisma "License"
[line_count]: https://img.shields.io/tokei/lines/github/joellefkowitz/cached-prisma "Line count"
[language_count]: https://img.shields.io/github/languages/count/joellefkowitz/cached-prisma "Language count"
[documentation]: https://img.shields.io/readthedocs/cached-prisma "Documentation"
[review_action]: https://img.shields.io/github/actions/workflow/status/JoelLefkowitz/cached-prisma/review.yml "Review action"
[codacy_quality]: https://img.shields.io/codacy/grade/00658bb866d6482184b86d16d3ce5ae8 "Codacy quality"
[codacy_coverage]: https://img.shields.io/codacy/coverage/00658bb866d6482184b86d16d3ce5ae8 "Codacy coverage"
[npm_version]: https://img.shields.io/npm/v/cached-prisma "NPM Version"
[npm_downloads]: https://img.shields.io/npm/dw/cached-prisma "NPM Downloads"
[open_issues]: https://img.shields.io/github/issues/joellefkowitz/cached-prisma "Open issues"
[closed_issues]: https://img.shields.io/github/issues-closed/joellefkowitz/cached-prisma "Closed issues"
[open_pulls]: https://img.shields.io/github/issues-pr/joellefkowitz/cached-prisma "Open pull requests"
[closed_pulls]: https://img.shields.io/github/issues-pr-closed/joellefkowitz/cached-prisma "Closed pull requests"
[contributors]: https://img.shields.io/github/contributors/joellefkowitz/cached-prisma "Contributors"
[monthly_commits]: https://img.shields.io/github/commit-activity/m/joellefkowitz/cached-prisma "Monthly commits"
[last_commit]: https://img.shields.io/github/last-commit/joellefkowitz/cached-prisma "Last commit"
