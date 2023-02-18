import { Memcached } from "./Memcached";

describe("Memcached", () => {
  it("should cache entries.", async () => {
    const cache = new Memcached("127.0.0.1:11211", 10);
    await cache.write("a", "1");

    expect(await cache.read("a")).toBe("1");
    expect(await cache.read("b")).toBeNull();
  });

  it("should update entries.", async () => {
    const cache = new Memcached("127.0.0.1:11211", 10);
    await cache.write("a", "1");
    await cache.write("a", "2");

    expect(await cache.read("a")).toBe("2");
  });

  it("should not cache for longer than its set lifetime.", async () => {
    const cache = new Memcached("127.0.0.1:11211", 1);
    await cache.write("a", "1");

    setTimeout(async () => expect(await cache.read("a")).toBeNull(), 1000);
  });
});
