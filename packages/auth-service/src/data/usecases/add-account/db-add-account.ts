import type { AddAccountModel, AddAccount, AddAccountRepository, Encrypter, CheckAccountByEmailRepository } from "./db-add-account-protocols"

export class DbAddAccount implements AddAccount{
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository
  private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository, checkAccountByEmailRepository: CheckAccountByEmailRepository){
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
    this.checkAccountByEmailRepository = checkAccountByEmailRepository
  }
  
  async add(accountData: AddAccountModel.Params): Promise<AddAccountModel.Result> {
    const exists = await this.checkAccountByEmailRepository.checkByEmail(accountData.email)
    let status = false

    console.log(exists)

    if(!exists){
      const hashedPassword = await this.encrypter.encrypt(accountData.password)
      status = await this.addAccountRepository.add({... accountData, password: hashedPassword})
    }

    return status
  }

  
}