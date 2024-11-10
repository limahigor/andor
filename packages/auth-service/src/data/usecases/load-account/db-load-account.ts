import type { CheckAccountByUsernameRepository, Encrypter, Hasher, LoadAccount, LoadAccountModel, LoadAccountRepository } from "./db-load-account-protocols";

export class DbLoadAccount implements LoadAccount {
  private readonly hasher: Hasher
  private readonly encrypter: Encrypter
  private readonly loadAccountRepository: LoadAccountRepository
  private readonly checkAccountByUsernameRepository: CheckAccountByUsernameRepository

  constructor(hasher: Hasher, encrypter: Encrypter, loadAccountRepository: LoadAccountRepository, checkAccountByUsernameRepository: CheckAccountByUsernameRepository) {
    this.hasher = hasher
    this.encrypter = encrypter
    this.loadAccountRepository = loadAccountRepository
    this.checkAccountByUsernameRepository = checkAccountByUsernameRepository
  }


  async login(loginData: LoadAccountModel.Params): Promise<LoadAccountModel.Result> {
    let status = ''
    const exists = await this.checkAccountByUsernameRepository.checkByUsername(loginData.username)

    if(!exists){
      const hashedPassword = await this.hasher.hasher(loginData.password)
      status = await this.loadAccountRepository.login({ ...loginData, password: hashedPassword })
    }

    return status
  }
}