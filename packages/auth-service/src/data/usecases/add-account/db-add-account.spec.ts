import { DbAddAccount } from "./db-add-account"
import type { AddAccountModel, AddAccountRepository, CheckAccountByEmailRepository, Encrypter } from "./db-add-account-protocols"

interface CheckAccountByEmailRepositoryWithResult extends CheckAccountByEmailRepository {
  result: boolean
}

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
  checkByEmailStub: CheckAccountByEmailRepositoryWithResult
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository{
    params: AddAccountModel.Params
    result = true

    async add (params: AddAccountModel.Params): Promise<AddAccountModel.Result>{
      this.params = params
      return this.result
    }
  }

  return new AddAccountRepositoryStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter{
    async encrypt (value: string): Promise<string>{
      return 'hashed_password'
    }
  }

  return new EncrypterStub()
}

const makeCheckByEmailStub = (): CheckAccountByEmailRepositoryWithResult => {
  class CheckByEmailStub implements CheckAccountByEmailRepository {
    email: string
    result = false

    async checkByEmail(email: string): Promise<boolean> {
      this.email = email
      return this.result
    }
  }

  return new CheckByEmailStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const checkByEmailStub = makeCheckByEmailStub()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub, checkByEmailStub)

  return { sut, encrypterStub, addAccountRepositoryStub, checkByEmailStub }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      username: 'valid_name',
      email: 'valid_mail',
      password: 'valid_password'
    }

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))

    const accountData = {
      username: 'valid_name',
      email: 'valid_mail',
      password: 'valid_password'
    }

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct data', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const accountData = {
      username: 'valid_name',
      email: 'valid_mail',
      password: 'valid_password'
    }

    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      username: 'valid_name',
      email: 'valid_mail',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

    const accountData = {
      username: 'valid_name',
      email: 'valid_mail',
      password: 'valid_password'
    }

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const accountData = {
      username: 'valid_name',
      email: 'valid_mail',
      password: 'valid_password'
    }

    const isValid = await sut.add(accountData)

    expect(isValid).toBe(true)
  })

  test('Should return false if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkByEmailStub } = makeSut()
  
    checkByEmailStub.result = true
  
    const accountData = {
      username: 'valid_name',
      email: 'valid_mail',
      password: 'valid_password'
    }
  
    const isValid = await sut.add(accountData)
    expect(isValid).toBe(false)
  })
})