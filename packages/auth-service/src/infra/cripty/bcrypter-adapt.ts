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

  async compare (plaintext: string, digest: string): Promise<boolean> {
    return await bcrypt.compare(plaintext, digest)
  }
}