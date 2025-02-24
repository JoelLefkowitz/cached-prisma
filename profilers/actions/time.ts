import { Scenario } from "../models/Scenario.model";
import { clients } from "../inputs/clients";
import { progress } from "./report";
import { range } from "ramda";

export const time = async ({
  name: title,
  cycles,
  task,
}: Scenario): Promise<Record<string, string>> => {
  const rows: Record<string, string> = {};

  for (const { name, client } of clients) {
    const timer = process.hrtime();

    for (const i of range(0, cycles)) {
      await progress(`${name} - ${title}: [${i}/${cycles}]`, () => task(client));
    }

    const [integer, fractional] = process.hrtime(timer);
    rows[name] = (integer + fractional / 10 ** 9).toFixed(6);
  }

  return rows;
};
