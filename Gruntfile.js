const postgresqlConnection = (password) =>
  `postgresql://prisma:${password}@localhost:5432/prisma`;

const cleanExecs = (arr) => [
  'clean',
  ...arr.map((i) => (i.includes(':') ? i : 'exec:'.concat(i))),
];

function env(name) {
  if (!process.env[name]) {
    throw new Error(`Missing: process.env['${name}'].`);
  }
  return process.env[name];
}

const exec = {
  cspell: 'npx cspell ".*" "*" "**/*"',
  eslint: 'npx esw "**/*.{js,ts}" --fix --ignore-path .gitignore',
  prettier: 'npx prettier . --write --ignore-path .gitignore --single-quote',
  remark: 'npx remark -r .remarkrc --ignore-path .gitignore . .github',

  mocha: "npx nyc mocha 'dist/**/*.js' -R mochawesome --exit",
  renameCoverage: 'mv coverage/cobertura-coverage.xml coverage/cobertura.xml',
  
  prismaGenerate: 'prisma generate --schema ./src/testdb/schema.prisma',
  prismaMigrate: 'prisma migrate dev --schema ./src/testdb/schema.prisma',

  tsc: 'npx tsc -p src/tsconfig.json',
  tscTest: 'npx tsc -p src/tsconfig.spec.json',

  postgres: {
    cmd: () => `
      docker run
      -p 5432:5432
      -e POSTGRES_DB=prisma
      -e POSTGRES_USER=prisma
      -e POSTGRES_PASSWORD=${env('POSTGRES_PASSWORD')}
      --rm -d postgres:13
    `,
  },

  memcached: {
    cmd: () => `
    docker run
      -p 11211:11211
      --rm -d memcached:1.6.9;
    `,
  },
};

module.exports = (grunt) => {
  grunt.initConfig({
    exec,
    clean: {
      file: 'cached-prisma-*.tgz',
      dist: './dist',
    },
    env: {
      db: {
        DATABASE_URL: () => postgresqlConnection(env('POSTGRES_PASSWORD')),
      },
    },
  });

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask(
    'lint',
    'Lint the source code.',
    cleanExecs(['cspell', 'eslint', 'remark'])
  );

  grunt.registerTask(
    'format',
    'Format the source code.',
    cleanExecs(['prettier'])
  );

  grunt.registerTask(
    'migrateDev',
    'Migrate the database in development mode.',
    cleanExecs(['env:db', 'prismaMigrate'])
  );

  grunt.registerTask(
    'build',
    'Compile the source code for a production environment.',
    cleanExecs(['tsc'])
  );

  grunt.registerTask(
    'test',
    'Compile and run unit tests.',
    cleanExecs(['env:db', 'tscTest', 'mocha', 'renameCoverage'])
  );
};
