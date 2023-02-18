import { concurrent } from "nps-utils";

export default {
  scripts: {
    lint: concurrent({
      spellcheck: "cspell . --dot --unique --no-progress --no-summary",
      eslint: "eslint . --ext .js,.jsx,.ts,.tsx --fix",
      typecheck: "tsc --noEmit",
      secrets: "trufflehog3",
    }),
    format: "prettier . --write",
    test: "jest",
    build: "tsc",
    profile: "ts-node ./profilers/time.ts",
  },
};
