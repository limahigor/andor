import { MongoClient, type ObjectId, type Collection } from "mongodb";

export const MongoHelper = {
  client: null as MongoClient | null,
  uri: null as string | null,

  async connect(uri: string): Promise<void> {
    if (!this.client) {
      const client = new MongoClient(uri);
      await client.connect();

      this.client = client;
      this.uri = uri
    }
  },

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client && this.uri) {
      await this.connect(this.uri)
    }

    if (!this.client) {
      throw new Error('MongoDB client is not connected.');
    }

    return this.client.db().collection(name);
  },

  async map<T extends { _id: ObjectId }>(collection: T): Promise<Omit<T, '_id'> & { id: string }> {
    const { _id, ...rest } = collection;
    return { ...rest, id: _id.toHexString() };
  }

};
