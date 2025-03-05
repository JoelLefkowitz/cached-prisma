import { LfuCache } from "./LfuCache";

describe("LfuCache", () => {
  it("should cache entries.", async () => {
    const cache = new LfuCache();
    await cache.write("a", "1");

    expect(await cache.read("a")).toBe("1");
    expect(await cache.read("b")).toBeNull();
  });

  it("should update entries.", async () => {
    const cache = new LfuCache();
    await cache.write("a", "1");
    await cache.write("a", "2");

    expect(await cache.read("a")).toBe("2");
  });

  it("should not exceed its maximum size.", async () => {
    const cache = new LfuCache(2);
    await cache.write("a", "1");
    await cache.write("b", "2");
    await cache.write("c", "3");

    expect(await cache.read("a")).toBeNull();
    expect(await cache.read("b")).toBe("2");
    expect(await cache.read("c")).toBe("3");
  });

  it("pops the least frequently used key.", async () => {
    const cache = new LfuCache(2);
    await cache.write("a", "1");
    await cache.write("b", "2");

    await cache.read("a");
    await cache.read("a");
    await cache.read("b");
    await cache.write("c", "3");

    expect(await cache.read("a")).toBe("1");
    expect(await cache.read("b")).toBeNull();
    expect(await cache.read("c")).toBe("3");
  });

  it("should flush.", async () => {
    const cache = new LfuCache();
    await cache.write("a", "1");

    await cache.flush();
    expect(await cache.read("a")).toBeNull();
  });
});
