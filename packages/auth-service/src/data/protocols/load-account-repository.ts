import type { LoginParams as LoginAccountParams } from "../../domain/usecases/load-account";

export interface LoadAccountRepository{
  login: (account: Params) => Promise<Result>
}

export type Params = LoginAccountParams;
export type Result = string