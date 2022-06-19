import { PrismaClient } from ".prisma/client";

export type Task = (client: PrismaClient) => Promise<void>;

export const read =
  (id: number) =>
  async (client: PrismaClient): Promise<void> => {
    await client.user.findFirst({ where: { id } });
  };

export const readWrite =
  (id: number, name: string) =>
  async (client: PrismaClient): Promise<void> => {
    await client.user.findFirst({ where: { id } });
    await client.user.create({ data: { name } });
  };
