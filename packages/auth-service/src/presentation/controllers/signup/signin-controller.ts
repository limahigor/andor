import { MissingParamError } from "../../errors";
import { badRequest, ok } from "../../helpers/http-helper";
import type { Controller, HttpRequest, HttpResponse, LoadAccount } from "./signup-protocols";

export class LoginController implements Controller {
  private readonly loadAccount: LoadAccount

  constructor(loadAccount: LoadAccount) {
    this.loadAccount = loadAccount
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['username', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError('username/password'))
      }
    }

    return ok('')
  }
}