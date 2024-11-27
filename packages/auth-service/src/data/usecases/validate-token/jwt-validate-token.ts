import type { ValidateResult, ValidateToken } from "../../../domain/usecases/validate-token";
import type { Decrypter } from "../../protocols";
import { error, ok } from "./helpers/helper-validate";

export class JwtValidateToken implements ValidateToken{
  private readonly decrypter: Decrypter

  constructor(decrypter: Decrypter) {
    this.decrypter = decrypter
  }

  async validate(token: string): Promise<ValidateResult>{
    const result = await this.decrypter.decrypt(token)

    if(result.id === ''){
      return error()
    }else{
      return ok(result.id)
    }
  }
}