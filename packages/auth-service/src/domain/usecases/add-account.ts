export interface AddAccount {
  add: (account: Params) => Promise<Result>;
}

export interface Params {
  name: string;
  email: string;
  password: string;
}

export type Result = boolean;