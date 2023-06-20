import { Prisma, Redis } from "../src";

export class RedisPrisma extends Prisma {
  static override cacheFactory = () => new Redis("127.0.0.1:3679", 10);
}
