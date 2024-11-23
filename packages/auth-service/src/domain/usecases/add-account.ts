export interface AddAccount {
  add: (account: Params) => Promise<Result>;
}

export interface Params {
  username: string;
  email: string;
  password: string;
}

export type Result = boolean;