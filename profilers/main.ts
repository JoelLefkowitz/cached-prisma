import { tabulate } from "./tabulate";
import { tests } from "./tests";
import { time } from "./timers";

(async () => {
  for (const {name, cycles, task} of tests) {
    const results = await time(cycles, task);

    console.log(
      tabulate(
        `${name} x ${cycles}`,
        ["Cache", "time/s"],
        Object.entries(results),
      ),
    );
  }
})();
