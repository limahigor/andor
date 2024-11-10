import type { AddAccountModel, AddAccount, AddAccountRepository, Hasher, CheckAccountByEmailRepository, CheckAccountByUsernameRepository } from "./db-add-account-protocols"

export class DbAddAccount implements AddAccount{
  private readonly hasher: Hasher
  private readonly addAccountRepository: AddAccountRepository
  private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  private readonly checkAccountByUsernameRepository: CheckAccountByUsernameRepository

  constructor (hasher: Hasher, addAccountRepository: AddAccountRepository, checkAccountByEmailRepository: CheckAccountByEmailRepository, checkAccountByUsernameRepository: CheckAccountByUsernameRepository){
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
    this.checkAccountByEmailRepository = checkAccountByEmailRepository
    this.checkAccountByUsernameRepository = checkAccountByUsernameRepository
  }
  
  async add(accountData: AddAccountModel.Params): Promise<AddAccountModel.Result> {
    let status = false

    const [emailExists, usernameExists] = await Promise.all([
      this.checkAccountByEmailRepository.checkByEmail(accountData.email),
      this.checkAccountByUsernameRepository.checkByUsername(accountData.username),
    ]);

    if(!emailExists && !usernameExists){
      const hashedPassword = await this.hasher.hasher(accountData.password)
      status = await this.addAccountRepository.add({... accountData, password: hashedPassword})
    }

    return status
  }

  
}