import { DbLoadAccount } from "./db-load-account"
import type { HashComparer, LoadAccountByUsernameRepository, Encrypter, LoadByUsernameResult } from "./db-load-account-protocols"

interface SutTypes {
  sut: DbLoadAccount
  comparerStub: HashComparer
  encrypterStub: Encrypter
  loadByUsernameStub: LoadAccountByUsernameRepository
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    param: string
    resultEncrypt = 'valid_token'

    async encrypt(param: string): Promise<string> {
      this.param = param
      return this.resultEncrypt
    }
  }

  return new EncrypterStub()
}

const makeComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    result = true

    async compare(plaitext: string, digest: string): Promise<boolean> {
      return this.result
    }
  }

  return new HashComparerStub()
}

const makeLoadByUsernameStub = (): LoadAccountByUsernameRepository => {
  class LoadAccountByUsernameStub implements LoadAccountByUsernameRepository {
    email: string
    result = {
      "id": "valid_id",
      "username": "valid_username",
      "password": "hashed_password"
    }

    async loadByUsername(username: string): Promise<LoadByUsernameResult> {
      this.email = username
      return this.result
    }
  }

  return new LoadAccountByUsernameStub()
}

const makeSut = (): SutTypes => {
  const comparerStub = makeComparer()
  const encrypterStub = makeEncrypterStub()
  const loadByUsernameStub = makeLoadByUsernameStub()
  const sut = new DbLoadAccount(comparerStub, encrypterStub, loadByUsernameStub)

  return {
    sut,
    comparerStub,
    encrypterStub,
    loadByUsernameStub
  }
}

describe('DbLoadAccount Repository', () => {
  test('Should call Comapare with correct password', async () => {
    const { sut, comparerStub } = makeSut()
    const comparerSpy = jest.spyOn(comparerStub, 'compare')

    const accountData = {
      username: 'valid_name',
      password: 'valid_password'
    }

    await sut.login(accountData)
    expect(comparerSpy).toHaveBeenCalledWith('valid_password', 'hashed_password')
  })

  test('Should call LoadByUsername with correct data', async () => {
    const { sut, loadByUsernameStub } = makeSut()
    const loadByUsernameSpy = jest.spyOn(loadByUsernameStub, 'loadByUsername')

    const accountData = {
      username: 'valid_name',
      password: 'valid_password'
    }

    await sut.login(accountData)
    expect(loadByUsernameSpy).toHaveBeenCalledWith('valid_name')
  })

  test('Should DbLoadAccount throw if Encrypter throws', async () => {
    const { sut, comparerStub } = makeSut()
    jest.spyOn(comparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))

    const accountData = {
      username: 'valid_name',
      password: 'valid_password'
    }

    const promise = sut.login(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call Encrypter with correct data', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      username: 'valid_name',
      password: 'valid_password'
    }

    await sut.login(accountData)
    expect(encrypterSpy).toHaveBeenCalledWith('valid_id')
  })

  test('Should return an valid token on success', async () => {
    const { sut } = makeSut()

    const accountData = {
      username: 'valid_name',
      password: 'valid_password'
    }

    const isValid = await sut.login(accountData)
    expect(isValid).toBe('valid_token')
  })
});