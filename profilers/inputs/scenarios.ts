import { PrismaClient } from ".prisma/client";
import { Scenario } from "../models/Scenario.model";

const create = (client: PrismaClient) =>
  client.user.create({ data: { name: "test" } });

const retrieve = (client: PrismaClient) =>
  client.user.findFirst({ where: { id: 1 } });

export const scenarios: Scenario[] = [
  {
    name: "Read",
    cycles: 10000,
    task: retrieve,
  },
  {
    name: "Read and overwrite",
    cycles: 1000,
    task: (client) => retrieve(client).then(() => create(client)),
  },
];
