import type { AddAccountRepository } from "../../../../data/protocols/add-account-repository"
import type { LoadByUsernameResult } from "../../../../data/protocols/load-account-by-username-repository"
import type * as AddAccountModel from "../../../../domain/usecases/add-account"
import type * as CheckAccountByEmailRepository from "../../../../data/protocols/check-account-by-email-repository"
import type * as CheckAccountByUsernameRepository from "../../../../data/protocols/check-account-by-username-repository"
import { MongoHelper } from "../helpers/mongo-helper"

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel.Params): Promise<AddAccountModel.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);

    return !!result.insertedId;
  }

  async loadByUsername(username: string): Promise<LoadByUsernameResult | null> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne(
      { username },
      { projection: { _id: 1, username: 1, password: 1 } }
    );
  
    return account ? await MongoHelper.map<LoadByUsernameResult>(account) : null;
  }

  async checkByEmail(email: string): Promise<CheckAccountByEmailRepository.Resul> {
    const accountCollection = await MongoHelper.getCollection('accounts');
  
    const account = await accountCollection.findOne(
      { email },
      { projection: { _id: 1 } }
    );
  
    return account !== null;
  }

  async checkByUsername(username: string): Promise<CheckAccountByUsernameRepository.Resul> {
    const accountCollection = await MongoHelper.getCollection('accounts');
  
    const account = await accountCollection.findOne(
      { username },
      { projection: { _id: 1 } }
    );

    console.log(account !== null)
  
    return account !== null;
  }
  
}