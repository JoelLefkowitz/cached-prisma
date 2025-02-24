import { Cache } from "../../models/Cache.model";
import { Client as HazelcastClient, IMap } from "hazelcast-client";

export class Hazelcast implements Cache {
  readonly lifetime: number;

  private client: Promise<HazelcastClient>;
  private map: Promise<IMap<string, string>>;

  constructor(host = "0.0.0.0", port = 5701, lifetime = 10) {
    this.client = HazelcastClient.newHazelcastClient({
      network: { clusterMembers: [`${host}:${port}`] },
    });

    this.lifetime = lifetime;

    this.map = this.client.then((client) => client.getMap("distributed-map"));
  }

  async read(key: string): Promise<string | null> {
    const map = await this.map;
    return await map.get(key);
  }

  async write(key: string, value: string): Promise<void> {
    const map = await this.map;
    await map.set(key, value, this.lifetime * 1000);
  }

  async flush(): Promise<void> {
    const map = await this.map;
    await map.flush();
  }

  async disconnect(): Promise<void> {
    const client = await this.client;
    await client.shutdown();
  }

  close(): void {
    this.disconnect();
  }
}
