import type { AddAccountModel, AddAccount, AddAccountRepository, Encrypter, CheckAccountByEmailRepository, CheckAccountByUsernameRepository } from "./db-add-account-protocols"

export class DbAddAccount implements AddAccount{
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository
  private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  private readonly checkAccountByUsernameRepository: CheckAccountByUsernameRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository, checkAccountByEmailRepository: CheckAccountByEmailRepository, checkAccountByUsernameRepository: CheckAccountByUsernameRepository){
    this.encrypter = encrypter
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
      const hashedPassword = await this.encrypter.encrypt(accountData.password)
      status = await this.addAccountRepository.add({... accountData, password: hashedPassword})
    }

    return status
  }

  
}