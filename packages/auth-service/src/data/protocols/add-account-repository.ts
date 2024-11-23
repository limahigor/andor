import type { Params as AddAccountParams } from "../../domain/usecases/add-account";

export interface AddAccountRepository{
  add: (account: Params) => Promise<Result>
}

export type Params = AddAccountParams;
export type Result = boolean