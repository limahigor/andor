import { BcryptAdapter } from "./bcrypter-adapt"
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hash')
}))

describe('BCrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_valye')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on succes', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    const hash = await sut.encrypt('any_valye')

    expect(hash).toBe('hash')
  })
})