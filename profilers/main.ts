import { scenarios } from "./inputs/scenarios";
import { tabulate } from "./actions/tabulate";
import { time } from "./actions/time";

(async () => {
  for (const scenario of scenarios) {
    const { name, cycles } = scenario;
    const results = await time(scenario);
    console.log(tabulate(`${name} x ${cycles}`, ["Cache", "time/s"], results));
  }
})();
