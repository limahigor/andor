export interface CheckAccountByUsernameRepository{
  checkByUsername: (email: string) => Promise<boolean>
}

export type Resul = boolean