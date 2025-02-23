import { Redis } from "./Redis";

describe("Redis", () => {
  const cache = new Redis("0.0.0.0", 6379, 1);

  afterAll(() => {
    cache.close();
  });

  it("should cache entries.", async () => {
    await cache.write("a", "1");
    expect(await cache.read("a")).toBe("1");
    expect(await cache.read("b")).toBeNull();
  });

  it("should update entries.", async () => {
    await cache.write("a", "1");
    await cache.write("a", "2");
    expect(await cache.read("a")).toBe("2");
  });

  it("should not cache for longer than its set lifetime.", async () => {
    await cache.write("a", "1");
    await new Promise((resolve) => setTimeout(resolve, cache.lifetime * 1000));
    expect(await cache.read("a")).toBeNull();
  });
});
