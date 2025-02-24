import { PrismaClient } from ".prisma/client";

export interface Scenario {
  name: string;
  cycles: number;
  task: (client: PrismaClient) => Promise<unknown>;
}
