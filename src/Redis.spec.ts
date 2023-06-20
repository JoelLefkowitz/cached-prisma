import { advanceTo, clear } from "jest-date-mock";
import { Redis } from "./Redis";

jest.useFakeTimers();

describe("Redis", () => {
  afterEach(() => {
    clear();
    jest.runOnlyPendingTimers();
    jest.clearAllTimers();
  });

  it("should cache entries.", async () => {
    const cache = new Redis("127.0.0.1:6379", 10);
    await cache.write("a", "1");

    expect(await cache.read("a")).toBe("1");
    expect(await cache.read("b")).toBeNull();
  });

  it("should update entries.", async () => {
    const cache = new Redis("127.0.0.1:6379", 10);
    await cache.write("a", "1");
    await cache.write("a", "2");

    expect(await cache.read("a")).toBe("2");
  });

  it("should not cache for longer than its set lifetime.", async () => {
    const cache = new Redis("127.0.0.1:6379", 1);
    await cache.write("a", "1");

    // advance the time by 2 seconds
    advanceTo(new Date(Date.now() + 2000));
    jest.runAllTimers();

    expect(await cache.read("a")).toBeNull();
  });
});
