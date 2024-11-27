import { MissingParamError, InvalidUsernameOrPassword } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import type { Controller, HttpRequest, HttpResponse, LoadAccount, LoginRequest } from "../signup/signup-protocols";

export class LoginController implements Controller {
  private readonly loadAccount: LoadAccount

  constructor(loadAccount: LoadAccount) {
    this.loadAccount = loadAccount
  }

  async handle(httpRequest: HttpRequest<LoginRequest>): Promise<HttpResponse> {
    try {
      console.log(`login controller: ${JSON.stringify(httpRequest)}`)
      
      if(!httpRequest.body){
        return badRequest(new MissingParamError('body'))
      }

      const requiredFields = ['username', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { username, password } = httpRequest.body as {
        username: string;
        password: string;
      };

      const token = await this.loadAccount.login({ username, password })

      if(token === ''){
        return badRequest(new InvalidUsernameOrPassword())
      }

      return ok(token)
    } catch (e) {
      return serverError()
    }
  }
}