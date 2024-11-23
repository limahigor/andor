export interface CheckAccountByEmailRepository{
  checkByEmail: (email: string) => Promise<boolean>
}

export type Resul = boolean