const { merge } = require('lodash');
const { simple } = require('quick-grunt');

const { set } = require('hashed-env');

set('POSTGRES_PASSWORD');

process.env.DATABASE_URL = 'postgresql://prisma:'.concat(
  process.env.POSTGRES_PASSWORD,
  '@localhost:5432/prisma'
);

const tasks = [
  {
    name: 'lint',
    description: 'Lint the source code.',
    exec: ['cspell', 'eslint', 'remark'],
  },
  {
    name: 'format',
    description: 'Format the source code.',
    exec: ['prettier', 'alphabetize'],
  },
  {
    name: 'database',
    description: 'Create and migrate a test database.',
    exec: ['prismaGenerate', 'postgres', 'prismaMigrate'],
  },
  {
    name: 'caches',
    description: 'Create test caches.',
    exec: ['memcached'],
  },
  {
    name: 'test',
    description: 'Compile and run unit tests.',
    clean: ['build', 'tests'],
    exec: ['compileTests', 'mocha', 'renameCoverage'],
  },
  {
    name: 'build',
    description: 'Compile the package for publishing.',
    clean: ['build'],
    exec: ['compile'],
  },
  {
    name: 'profile',
    description: 'Compile and run profilers.',
    clean: ['build'],
    exec: ['compileProfilers', 'profileTime'],
  },
];

const clean = {
  build: ['dist'],
  tests: ['coverage', '.mocha', '.nyc_output'],
};

const copy = {};

const linters = {
  cspell: 'npx cspell ".*" "*" "**/*"',
  eslint: 'npx esw "**/*.{js,jsx,ts,tsx}" --fix --ignore-path .gitignore',
  remark: 'npx remark -r .remarkrc --ignore-path .gitignore . .github',
  missing: 'conductor cspell words',
};

const formatters = {
  prettier: 'npx prettier . --write',
  alphabetize: 'conductor cspell format',
};

const tsc = {
  compile: 'npx tsc -p src',
  compileTests: 'npx tsc -p src/tsconfig.spec.json',
  compileProfilers: 'npx tsc -p profilers',
};

const tests = {
  mocha:
    "npx nyc mocha 'dist/**/*.js --exit -R mochawesome --reporter-options reportDir=.mocha",
  renameCoverage: 'mv coverage/cobertura-coverage.xml coverage/cobertura.xml',
};

const docs = {
  quickdocs: 'quickdocs .quickdocs.yml',
};

const profilers = {
  profileTime: 'node dist/profilers/time.js',
};

const prisma = {
  prismaGenerate: 'prisma generate --schema ./src/testdb/schema.prisma',
  prismaMigrate: 'prisma migrate dev --schema ./src/testdb/schema.prisma',
};

const docker = {
  memcached: `docker run
      -p 11211:11211
      --rm -d memcached:1.6.9;
    `,
  postgres: `
      docker run
      -p 5432:5432
      -e POSTGRES_DB=prisma
      -e POSTGRES_USER=prisma 
      -e POSTGRES_PASSWORD=${process.env.POSTGRES_PASSWORD}
      --rm -d postgres:13
    `,
};

const exec = merge(
  linters,
  formatters,
  tsc,
  tests,
  docs,
  profilers,
  prisma,
  docker
);

module.exports = simple({ clean, copy, exec }, tasks);
