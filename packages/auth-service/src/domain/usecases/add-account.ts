export interface AddAccount {
  add: (account: Params) => Promise<Result>;
}

export interface Params {
  username: string;
  email: string;
  password: string;
}

export interface SignupRequest {
  email?: string;
  username?: string;
  password?: string;
  passwordConfirmation?: string;
}

export type Result = boolean;