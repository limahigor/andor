import { MissingParamError, InvalidParamError, ServerError } from "../../errors"
import { DataInUse } from "../../errors/data-in-use-error"
import { ok } from "../../helpers/http-helper"
import { SignUpController } from './signup-controller'
import type { EmailValidator, HttpRequest, AddAccount, AddAccountModel, SignupRequest, } from './signup-protocols'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    params: AddAccountModel.Params
    result = true

    async add(params: AddAccountModel.Params): Promise<AddAccountModel.Result> {
      this.params = params
      return this.result
    }
  }

  return new AddAccountStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no username is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest<SignupRequest> = {
      body: {
        email: 'email@gmail.com',
        password: 'mypassword',
        passwordConfirmation: 'mypassword'
      }
    };

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('username'))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest<SignupRequest> = {
      body: {
        username: 'any_name',
        password: 'mypassword',
        passwordConfirmation: 'mypassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest<SignupRequest> = {
      body: {
        username: 'any_name',
        email: 'email@gmail.com',
        passwordConfirmation: 'mypassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest<SignupRequest> = {
      body: {
        username: 'any_name',
        email: 'email@gmail.com',
        password: 'mypassword',
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest<SignupRequest> = {
      body: {
        username: 'any_name',
        email: 'email@gmail.com',
        password: 'mypassword',
        passwordConfirmation: 'otherpassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest: HttpRequest<SignupRequest> = {
      body: {
        username: 'any_name',
        email: 'invalid_email@gmail.com',
        password: 'mypassword',
        passwordConfirmation: 'mypassword',
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 400 if data in use', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockResolvedValueOnce(false)

    const httpRequest: HttpRequest<SignupRequest> = {
      body: {
        username: 'any_name',
        email: 'invalid_email@gmail.com',
        password: 'mypassword',
        passwordConfirmation: 'mypassword',
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new DataInUse())
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest: HttpRequest<SignupRequest> = {
      body: {
        username: 'any_name',
        email: 'email@gmail.com',
        password: 'mypassword',
        passwordConfirmation: 'mypassword'
      }
    }
    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('email@gmail.com')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest: HttpRequest<SignupRequest> = {
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

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => await Promise.reject(new Error()))

    const httpRequest: HttpRequest<SignupRequest> = {
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

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest: HttpRequest<SignupRequest> = {
      body: {
        username: 'any_name',
        email: 'email@gmail.com',
        password: 'mypassword',
        passwordConfirmation: 'mypassword',
      }
    }

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      username: 'any_name',
      email: 'email@gmail.com',
      password: 'mypassword'
    })
  })

  test('Should return 200 if an valid data provided', async () => {
    const { sut, addAccountStub } = makeSut()

    const httpRequest: HttpRequest<SignupRequest> = {
      body: {
        username: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'valid_mypassword',
        passwordConfirmation: 'valid_mypassword',
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    // @ts-expect-error the property is necessary for the tests success but not necessary in prod implementation
    expect(httpResponse).toEqual(ok(addAccountStub.result))
  })
})