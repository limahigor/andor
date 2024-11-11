import type { LoadAccountByUsernameRepository, Encrypter, HashComparer, LoadAccount, LoadAccountModel } from "./db-load-account-protocols";

export class DbLoadAccount implements LoadAccount {
  private readonly comparer: HashComparer
  private readonly encrypter: Encrypter
  private readonly loadAccountByUsernameRepository: LoadAccountByUsernameRepository

  constructor(comparer: HashComparer, encrypter: Encrypter, loadAccountByUsernameRepository: LoadAccountByUsernameRepository) {
    this.comparer = comparer
    this.encrypter = encrypter
    this.loadAccountByUsernameRepository = loadAccountByUsernameRepository
  }

  async login(loginData: LoadAccountModel.Params): Promise<LoadAccountModel.Result> {
    let status = ''

    const account = await this.loadAccountByUsernameRepository.loadByUsername(loginData.username)
    if(account) {
      const isValid = await this.comparer.compare(loginData.password, account.password)
      if (isValid) {
        status = await this.encrypter.encrypt(account.id)
      }
    }

    return status
  }
}