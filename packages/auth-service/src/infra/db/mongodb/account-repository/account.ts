import type { AddAccountRepository } from "../../../../data/protocols/add-account-repository"
import type * as AddAccountModel from "../../../../domain/usecases/add-account"
import type * as CheckAccountByEmailRepository from "../../../../data/protocols/check-account-by-email-repository"
import { MongoHelper } from "../helpers/mongo-helper"

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel.Params): Promise<AddAccountModel.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);

    return !!result.insertedId;
  }

  async checkByEmail(email: string): Promise<CheckAccountByEmailRepository.Resul> {
    const accountCollection = await MongoHelper.getCollection('accounts');
  
    const account = await accountCollection.findOne(
      { email },
      { projection: { _id: 1 } }
    );
  
    return account !== null;
  }
  
}