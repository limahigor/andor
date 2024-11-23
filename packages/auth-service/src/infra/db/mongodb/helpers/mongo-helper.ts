/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { MongoClient, type Collection } from "mongodb";

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,

  async connect(uri: string): Promise<void> {
    if (!this.client) {
      const client = new MongoClient(uri);
      await client.connect();

      this.client = client;
      this.uri = uri
    }
  },

  async disconnect(): Promise<void> {
    if(this.client) {
      await this.client.close();
      this.client = null;
    }
  },

  async getCollection(name: string): Promise<Collection> {
    if(!this.client){
      await this.connect(this.uri)
    }
    return this.client.db().collection(name);
  },

  async map<R>(collection: any): Promise<R> {
    const { _id, ...rest } = collection;

    return { ...rest, id: _id.toString() }
  }

};
