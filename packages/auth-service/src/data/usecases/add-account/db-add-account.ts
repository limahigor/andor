import type { AddAccountModel, AddAccount, AddAccountRepository, Encrypter } from "./db-add-account-protocols"

export class DbAddAccount implements AddAccount{
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository){
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }
  
  async add(accountData: AddAccountModel.Params): Promise<AddAccountModel.Result> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)

    const status = await this.addAccountRepository.add({... accountData, password: hashedPassword})

    return status
  }
}