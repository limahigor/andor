import { InvalidUsernameOrPassword, MissingParamError, ServerError } from "../../errors"
import { LoginController } from "./signin-controller"
import type { HttpRequest, LoadAccount, LoadAccountModel } from "./signin-protocols"

interface SutTypes {
  sut: LoginController
  loadAccountStub: LoadAccountStubWithResult
}

interface LoadAccountStubWithResult extends LoadAccount{
  result: string
}

const makeLoadAccount = (): LoadAccountStubWithResult => {
  class LoadAccountStub implements LoadAccountStubWithResult {
    params: LoadAccountModel.LoginParams
    result = 'valid_token'

    async login(params: LoadAccountModel.LoginParams): Promise<LoadAccountModel.LoginResult> {
      this.params = params
      return this.result
    }
  }

  return new LoadAccountStub()
}

const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccount()
  const sut = new LoginController(loadAccountStub)

  return {
    sut,
    loadAccountStub
  }
}

describe('Signin Controller', () => {
  test('Should return 400 if no username is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'mypassword',
      }
    };

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('username'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        username: 'any_username',
      }
    };

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if invalid username/password', async () => {
    const { sut, loadAccountStub } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        username: 'any_username',
        password: 'mypassword'
      }
    };

    loadAccountStub.result = ''

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidUsernameOrPassword())
  })

  test('Should call LoadAccount with correct values', async () => {
    const { sut, loadAccountStub } = makeSut()
    const loginSpy = jest.spyOn(loadAccountStub, 'login')

    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'mypassword',
      }
    }

    await sut.handle(httpRequest)

    expect(loginSpy).toHaveBeenCalledWith({
      username: 'any_name',
      password: 'mypassword'
    })
  })

  test('Should return 500 if LoadAccount throws', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest.spyOn(loadAccountStub, 'login').mockImplementationOnce(async () => await Promise.reject(new Error()))

    const httpRequest = {
      body: {
        username: 'any_name',
        email: 'email@gmail.com',
        password: 'mypassword',
        passwordConfirmation: 'mypassword',
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
});