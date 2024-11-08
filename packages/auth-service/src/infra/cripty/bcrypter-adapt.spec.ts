import { BcryptAdapter } from "./bcrypter-adapt"
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hash')
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)

  return sut
}

describe('BCrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    
    await sut.encrypt('any_value')
  
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on succes', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_value')

    expect(hash).toBe('hash')
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut();

    (bcrypt.hash as jest.Mock).mockRejectedValueOnce(new Error());

    await expect(sut.encrypt('any_value')).rejects.toThrow();
  })
})