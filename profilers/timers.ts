import { Task } from "./tests";
import { caches } from "./caches";

export const time = async (
  cycles: number,
  task: Task,
): Promise<Record<string, string>> => {
  const rows: Record<string, string> = {};

  for (const { name, cache } of caches) {
    const timer = process.hrtime();

    for (const _ of Array(cycles).fill(null)) {
      await task(cache);
    }

    const [integer, fractional] = process.hrtime(timer);
    rows[name] = (integer + fractional / 10 ** 9).toFixed(6);
  }

  return rows;
};
