import bcrypt from 'bcrypt'
import type { Hasher } from '../../data/protocols/hasher'

export class BcryptAdapter implements Hasher{
  private readonly salt: number

  constructor (salt: number){
    this.salt = salt
  }

  async hasher(value: string): Promise<string>{
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
} 