import { Cache } from "./Cache.model";
import { PrismaClient } from "@prisma/client";

export interface Client {
  cache?: Cache;
  client?: PrismaClient;
}
