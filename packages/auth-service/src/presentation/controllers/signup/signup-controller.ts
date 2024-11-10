import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from "../../errors"
import type { EmailValidator, HttpRequest, AddAccount, Controller, HttpResponse } from './signup-protocols'
import { DataInUse } from '../../errors/data-in-use-error'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['username', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { username, email, password, passwordConfirmation } = httpRequest.body as {
        username: string;
        email: string;
        password: string;
        passwordConfirmation: string;
      };

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const status = await this.addAccount.add({
        username, email, password
      })

      if (!status) {
        return badRequest(new DataInUse())
      }

      return ok(status)
    } catch (error) {
      return serverError()
    }
  }
}