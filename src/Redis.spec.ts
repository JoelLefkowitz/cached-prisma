import { Redis } from "./Redis";
const logger = console;
const redisInitObject = {
  lifetime: 10,
  redisOptions: { host: "127.0.0.1", port: 6379 },
  cacheKeyPrefix: "dbcache",
  logger,
};
describe("Redis", () => {
  it("should cache entries.", async () => {
    const cache = new Redis(redisInitObject);
    await cache.write("a", "1");

    expect(await cache.read("a")).toBe("1");
    expect(await cache.read("b")).toBeNull();
  });

  it("should update entries.", async () => {
    const cache = new Redis(redisInitObject);
    await cache.write("a", "1");
    await cache.write("a", "2");

    expect(await cache.read("a")).toBe("2");
  });

  it("should not cache for longer than its set lifetime.", async () => {
    const cache = new Redis(redisInitObject);
    await cache.write("a", "1");

    setTimeout(async () => {
      expect(await cache.read("a")).toBeNull();
    }, 1000);
  });
});
