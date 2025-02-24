import { PrismaClient } from "@prisma/client";

export interface Client {
  name: string;
  client: PrismaClient;
}
