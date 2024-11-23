import { JwtValidateToken } from "../../data/usecases/validate-token/jwt-validate-token";
import { JwtAdapter } from "../../infra/cripty/jwt-adapter";
import { ValidateTokenController } from "../../presentation/controllers/token/validate-token-controller";

export const makeValidateController = (): ValidateTokenController => {
  const decrypter = new JwtAdapter(process.env.JWT_SECRET ?? 'tj67O==5H')

  const jwTokenValidate = new JwtValidateToken(decrypter)

  return new ValidateTokenController(jwTokenValidate)
}