/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { MongoClient, type Collection } from "mongodb";

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect(uri: string): Promise<void> {
    if (!this.client) {
      const client = new MongoClient(uri);
      await client.connect();
      this.client = client;
    }
  },

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  },

  getCollection(name: string): Collection {
    console.log('Accessing database:', this.client.db().databaseName); // Log para debug
    return this.client.db().collection(name);
  },
};
