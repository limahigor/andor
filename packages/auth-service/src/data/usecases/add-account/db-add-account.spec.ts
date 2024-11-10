import { DbAddAccount } from "./db-add-account"
import type { AddAccountModel, AddAccountRepository, CheckAccountByEmailRepository, CheckAccountByUsernameRepository, Hasher } from "./db-add-account-protocols"

interface CheckAccountByEmailRepositoryWithResult extends CheckAccountByEmailRepository {
  result: boolean
}

interface CheckAccountByUsernameRepositoryWithResult extends CheckAccountByUsernameRepository {
  result: boolean
}

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  checkByEmailStub: CheckAccountByEmailRepositoryWithResult
  checkByUsernameStub: CheckAccountByUsernameRepositoryWithResult
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

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher{
    async hasher (value: string): Promise<string>{
      return 'hashed_password'
    }
  }

  return new HasherStub()
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
  const addAccountRepositoryStub = makeAddAccountRepository()
  const checkByEmailStub = makeCheckByEmailStub()
  const checkByUsernameStub = makeCheckByUsernameStub()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, checkByEmailStub, checkByUsernameStub)

  return { sut, encrypterStub: hasherStub, addAccountRepositoryStub, checkByEmailStub, checkByUsernameStub }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub: hasherStub } = makeSut()
    const encryptSpy = jest.spyOn(hasherStub, 'hasher')

    const accountData = {
      username: 'valid_name',
      email: 'valid_mail',
      password: 'valid_password'
    }

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub: hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hasher').mockReturnValueOnce(Promise.reject(new Error()))

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

  test('Should return false if CheckAccountByUsernameRepository returns true', async () => {
    const { sut, checkByUsernameStub } = makeSut()
  
    checkByUsernameStub.result = true
  
    const accountData = {
      username: 'valid_name',
      email: 'valid_mail',
      password: 'valid_password'
    }
  
    const isValid = await sut.add(accountData)
    expect(isValid).toBe(false)
  })
})