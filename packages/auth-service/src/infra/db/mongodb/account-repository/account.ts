import type { AddAccountRepository } from "../../../../data/protocols/add-account-repository"
import type * as AddAccountModel from "../../../../domain/usecases/add-account"
import { MongoHelper } from "../helpers/mongo-helper"

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel.Params): Promise<AddAccountModel.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);

    return !!result.insertedId;
  }

}