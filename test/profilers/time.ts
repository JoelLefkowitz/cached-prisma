import { Task, read, readWrite } from "./tasks";

import { PrismaClient } from ".prisma/client";
import { caches } from "./caches";

const cycles = 1000;

export const time = async (
  client: PrismaClient,
  task: Task,
): Promise<number> => {
  const time = process.hrtime();

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < cycles; i++) {
    // eslint-disable-next-line no-await-in-loop
    await task(client);
  }

  const hrtime = process.hrtime(time);
  return hrtime[0] + hrtime[1] / 10 ** 9;
};

const profile = async (title: string, task: Task) =>
  Promise.all(
    caches.map(async (i) => ({
      name: i.name,
      data: { "time /s": await time(i.cache, task) },
    })),
  ).then((results) => {
    console.log(title);
    console.table(
      results.reduce((acc, x) => ({ ...acc, ...{ [x.name]: x.data } }), {}),
    );
  });

Promise.all([
  profile(`${cycles} read calls:`, read(1)),
  profile(`${cycles} read and write calls:`, readWrite(1, "test")),
]).catch(console.error);
