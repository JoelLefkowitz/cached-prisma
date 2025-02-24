import { PrismaClient } from ".prisma/client";

export type Task = (client: PrismaClient) => Promise<unknown>;

export type Test = {
  name: string;
  cycles: number;
  task: Task;
};

export const tests = [
  {
    name: "Read",
    cycles: 1000,
    task: (client: PrismaClient) => client.user.findFirst({ where: { id: 1 } }),
  },
  {
    name: "Read and overwrite",
    cycles: 100,
    task: (client: PrismaClient) =>
      client.user
        .findFirst({ where: { id: 1 } })
        .then(() => client.user.create({ data: { name: "test" } })),
  },
];
