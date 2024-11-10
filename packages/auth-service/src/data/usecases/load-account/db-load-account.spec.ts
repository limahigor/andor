import { DbLoadAccount } from "./db-load-account"
import type { LoadAccountRepository, Hasher, CheckAccountByUsernameRepository, LoadAccountModel, Encrypter } from "./db-load-account-protocols"

interface CheckAccountByUsernameRepositoryWithResult extends CheckAccountByUsernameRepository {
  result: boolean
}

interface SutTypes {
  sut: DbLoadAccount
  hasherStub: Hasher
  encrypterStub: Encrypter
  loadAccountRepositoryStub: LoadAccountRepository
  checkByUsernameStub: CheckAccountByUsernameRepositoryWithResult
}

const makeLoadAccountRepository = (): LoadAccountRepository => {
  class LoadAccountRepositoryStub implements LoadAccountRepository {
    params: LoadAccountModel.Params
    result = 'valid_token'

    async login(params: LoadAccountModel.Params): Promise<LoadAccountModel.Result> {
      this.params = params
      return this.result
    }
  }

  return new LoadAccountRepositoryStub()
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    param: string
    resultEncrypt = 'valid_token'
    resultDecrypt = 'valid_id'

    async encrypt(param: string): Promise<string> {
      this.param = param
      return this.resultEncrypt
    }
  }

  return new EncrypterStub()
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hasher(value: string): Promise<string> {
      return 'hashed_password'
    }
  }

  return new HasherStub()
}

const makeCheckByUsernameStub = (): CheckAccountByUsernameRepositoryWithResult => {
  class CheckByUsernameStub implements CheckAccountByUsernameRepository {
    email: string
    result = false

    async checkByUsername(username: string): Promise<boolean> {
      this.email = username
      return this.result
    }
  }

  return new CheckByUsernameStub()
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const encrypterStub = makeEncrypterStub()
  const loadAccountRepositoryStub = makeLoadAccountRepository()
  const checkByUsernameStub = makeCheckByUsernameStub()
  const sut = new DbLoadAccount(hasherStub, encrypterStub, loadAccountRepositoryStub, checkByUsernameStub)

  return {
    sut,
    hasherStub,
    encrypterStub,
    loadAccountRepositoryStub,
    checkByUsernameStub,
  }
}

describe('DbLoadAccount Repository', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hasher')

    const accountData = {
      username: 'valid_name',
      password: 'valid_password'
    }

    await sut.login(accountData)
    expect(hasherSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should DbLoadAccount throw if Encrypter throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hasher').mockReturnValueOnce(Promise.reject(new Error()))

    const accountData = {
      username: 'valid_name',
      password: 'valid_password'
    }

    const promise = sut.login(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadAccountRepository with correct data', async () => {
    const { sut, loadAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(loadAccountRepositoryStub, 'login')

    const accountData = {
      username: 'valid_name',
      password: 'valid_password'
    }

    await sut.login(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      username: 'valid_name',
      password: 'hashed_password'
    })
  })

  test('Should void null if CheckAccountByUsernameRepository returns true', async () => {
    const { sut, checkByUsernameStub } = makeSut()
  
    checkByUsernameStub.result = true
  
    const accountData = {
      username: 'valid_name',
      password: 'valid_password'
    }
  
    const isValid = await sut.login(accountData)
    expect(isValid).toBe('')
  })
});