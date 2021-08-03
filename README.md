# Cached Prisma

A Prisma client abstraction that simplifies caching.

## Status

| Source     | Shields                                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Project    | ![release][release_shield] ![license][license_shield] ![lines][lines_shield] ![languages][languages_shield]                                   |
| Health     | ![readthedocs][readthedocs_shield] ![github_review][github_review_shield] ![codacy][codacy_shield] ![codacy_coverage][codacy_coverage_shield] |
| Publishers | ![npm][npm_shield] ![npm_downloads][npm_downloads_shield]                                                                                     |
| Repository | ![issues][issues_shield] ![issues_closed][issues_closed_shield] ![pulls][pulls_shield] ![pulls_closed][pulls_closed_shield]                   |
| Activity   | ![contributors][contributors_shield] ![monthly_commits][monthly_commits_shield] ![last_commit][last_commit_shield]                            |

## Usage

To implement a central cache and to keep a single database connection the Prisma class is a singleton:

```ts
import { Prisma } from 'cached-prisma';

const client1 = new Prisma().client;
const client2 = new Prisma().client;

client1 === client2;
```

Caches must implement read and write methods:

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

To control the caching mechanism you can extend the Prisma class:

```ts
import { LruCache } from 'cached-prisma';

class CustomPrisma extends Prisma {
  cacheFactory = () => new LruCache(10);
}
```

The default cache is a fixed size queue that pops values as it surpasses its maximum length.

```ts
new LruCache(100);
```

Memcached support is provided out of the box:

```ts
import { Memcached } from 'cached-prisma';

class CustomPrisma extends Prisma {
  cacheFactory = () => new Memcached('127.0.0.1:11211', 10);
}
```

Note that the second parameter to the Memcached constructor is the storage lifetime of each write in seconds.

We cache the following methods which do not mutate state and behave idempotently:

- findUnique
- findMany
- findFirst
- queryRaw
- aggregate
- count

## Tests

To run unit tests:

```bash
grunt test
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

Please read this repository's [CHANGELOG](CHANGELOG.md) for details on changes that have been made.

## Contributing

Please read this repository's guidelines on [CONTRIBUTING](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Contributors

- **Joel Lefkowitz** - _Initial work_ - [Joel Lefkowitz][author]

[![Buy Me A Coffee][coffee_button]][coffee]

## Remarks

Lots of love to the open source community!

![Be kind][be_kind]

<!-- Public links -->

[semver]: http://semver.org/
[be_kind]: https://media.giphy.com/media/osAcIGTSyeovPq6Xph/giphy.gif
[coffee]: https://www.buymeacoffee.com/joellefkowitz
[coffee_button]: https://cdn.buymeacoffee.com/buttons/default-blue.png
[readthedocs]: https://cached-prisma.readthedocs.io/en/latest/

<!-- Acknowledgments -->

[author]: https://github.com/joellefkowitz

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
