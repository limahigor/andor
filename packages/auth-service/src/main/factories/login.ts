import "dotenv/config"
import { LoginController } from "../../presentation/controllers/signup/signin-controller";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { BcryptAdapter } from "../../infra/cripty/bcrypter-adapt";
import { DbLoadAccount } from "../../data/usecases/load-account/db-load-account";
import { JwtAdapter } from "../../infra/cripty/jwt-adapter";

export const makeLoginController = (): LoginController => {
  const salt = 12
  const comparer = new BcryptAdapter(salt)
  const loadAccountRepository = new AccountMongoRepository()
  
  const encrypter = new JwtAdapter(process.env.JWT_SECRET ?? 'tj67O==5H')

  const dbLoadAccount = new DbLoadAccount(comparer, encrypter, loadAccountRepository)

  return new LoginController(dbLoadAccount)
}