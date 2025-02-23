import { Prisma } from "./Prisma";

describe("Prisma", () => {
  it("has a shared client instance.", () => {
    const client1 = new Prisma().client;
    const client2 = new Prisma().client;

    expect(client1).toEqual(client2);
  });

  it("has a shared cache instance.", () => {
    const cache1 = new Prisma().cache;
    const cache2 = new Prisma().cache;

    expect(cache1).toEqual(cache2);
  });

  it("caches results.", async () => {
    const prisma = new Prisma();

    const user = await prisma.client.user.create({ data: { name: "test" } });
    await prisma.client.user.findFirst({ where: { id: user.id } });

    expect(
      await prisma.cache.read(
        JSON.stringify({
          field: "user",
          action: "findFirst",
          args: [{ where: { id: user.id } }],
        }),
      ),
    ).toEqual(JSON.stringify(user));
  });

  it("flushes the cache after mutations.", async () => {
    const prisma = new Prisma();

    const user = await prisma.client.user.create({ data: { name: "test" } });
    await prisma.client.user.findFirst({ where: { id: user.id } });
    await prisma.client.user.create({ data: { name: "test" } });

    expect(
      await prisma.cache.read(
        JSON.stringify({
          field: "user",
          action: "findFirst",
          args: [{ where: { id: user.id } }],
        }),
      ),
    ).toBeNull();
  });
});
