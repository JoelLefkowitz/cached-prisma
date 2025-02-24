import { Client } from "../models/Client.model";
import { Prisma } from "../../src";
import { PrismaClient } from ".prisma/client";
import { caches } from "./caches";

export const clients: Client[] = Object.entries(caches)
  .map(([name, factory]) => {
    Prisma.cacheFactory = () => new factory();
    const { client } = new Prisma();
    return { name, client };
  })
  .concat({
    name: "Without a cache",
    client: new PrismaClient(),
  });
