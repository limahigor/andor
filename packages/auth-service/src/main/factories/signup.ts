import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/cripty/bcrypter-adapt";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { SignUpController } from "../../presentation/controllers/signup/signup-controller";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeSignupController = (): SignUpController => {
  const salt = 12
  const encrypter = new BcryptAdapter(salt)

  const addAccountRepository = new AccountMongoRepository()

  const dbAddAccount = new DbAddAccount(encrypter, addAccountRepository, addAccountRepository)

  const emailValidator = new EmailValidatorAdapter()
  
  return new SignUpController(emailValidator, dbAddAccount)
}