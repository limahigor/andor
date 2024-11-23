export interface LoadAccountByUsernameRepository {
  loadByUsername: (username: string) => Promise<LoadByUsernameResult | null>;
}

export interface LoadByUsernameResult{
  id: string;
  username: string;
  password: string;
}
