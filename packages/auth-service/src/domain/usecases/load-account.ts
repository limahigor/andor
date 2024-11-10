export interface LoadAccount {
  login: (account: LoginParams) => Promise<LoginResult>;
}

export interface LoginParams {
  username: string;
  password: string;
}

export type LoginResult = string;