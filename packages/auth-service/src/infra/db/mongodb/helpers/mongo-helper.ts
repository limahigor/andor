import { MongoClient } from "mongodb";

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect(this: typeof MongoHelper, uri: string): Promise<void> {
    if (!this.client) {
      this.client = await MongoClient.connect(uri);
    }
  },

  async disconnect(this: typeof MongoHelper): Promise<void> {
    if (this.client) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this.client.close();
      this.client = null;
    }
  }
};
