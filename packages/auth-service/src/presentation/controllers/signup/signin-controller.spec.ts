import { MissingParamError } from "../../errors"
import { LoginController } from "./signin-controller"
import type { HttpRequest, LoadAccount, LoadAccountModel } from "./signup-protocols"

interface SutTypes {
  sut: LoginController
  loadAccountStub: LoadAccount
}

const makeLoadAccount = (): LoadAccount => {
  class LoadAccountStub implements LoadAccount {
    params: LoadAccountModel.LoginParams
    result = 'valid_token'

    async add(params: LoadAccountModel.LoginParams): Promise<LoadAccountModel.LoginResult> {
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
        email: 'email@gmail.com',
        password: 'mypassword',
        passwordConfirmation: 'mypassword'
      }
    };

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('username/password'))
  })

  // test('Should return 400 if no password is provided', async () => {
  //   const { sut } = makeSut()
  //   const httpRequest: HttpRequest = {
  //     body: {
  //       email: 'email@gmail.com',
  //       password: 'mypassword',
  //       passwordConfirmation: 'mypassword'
  //     }
  //   };

  //   const httpResponse = await sut.handle(httpRequest)

  //   expect(httpResponse.statusCode).toBe(400)
  //   expect(httpResponse.body).toEqual(new MissingParamError('username/password'))
  // })
});