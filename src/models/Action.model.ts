import { Listed } from "./Listed.model";

export const actions = {
  pure: [
    "aggregate",
    "count",
    "findFirst",
    "findMany",
    "findUnique",
    "queryRaw",
  ],
  impure: [
    "create",
    "createMany",
    "delete",
    "deleteMany",
    "executeRaw",
    "update",
    "updateMany",
    "upsert",
  ],
} as const;

export type PureAction = Listed<typeof actions.pure>;

export type ImpureAction = Listed<typeof actions.impure>;

export type Action = PureAction | ImpureAction;
