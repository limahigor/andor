import { MissingParamError } from "../../errors";
import { badRequest, ok, unauthorized } from "../../helpers/http-helper";
import type { Controller, HttpRequest, HttpResponse } from "../../protocols";
import type { ValidateRequest, ValidateResult, ValidateToken } from "./validate-token-controller-protocols";

export class ValidateTokenController implements Controller {
  private readonly validateToken: ValidateToken

  constructor(validateToken: ValidateToken) {
    this.validateToken = validateToken
  }

  async handle(httpRequest: HttpRequest<ValidateRequest | undefined>): Promise<HttpResponse<ValidateResult | Error>> {
    try {
      const { token } = httpRequest.body ?? {};

      if (!token) {
        return badRequest(new MissingParamError('token'));
      }

      const result = await this.validateToken.validate(token);
      return ok(result);
    } catch (error) {
      return unauthorized();
    }
  }

}