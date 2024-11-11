import { BcryptAdapter } from "./bcrypter-adapt"
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hash'),
  compare: jest.fn().mockResolvedValue(true)
}))


const salt = 12
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)

  return sut
}

describe('BCrypt Adapter', () => {
  describe('Hash', () => {
    test('Should call bcrypt with correct value', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hasher('any_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a hash on succes', async () => {
      const sut = makeSut()
      const hash = await sut.hasher('any_value')

      expect(hash).toBe('hash')
    })

    test('Should throw if bcrypt throws', async () => {
      const sut = makeSut();

      (bcrypt.hash as jest.Mock).mockRejectedValueOnce(new Error());

      await expect(sut.hasher('any_value')).rejects.toThrow();
    })
  })

  describe('Compare', () => {
    test('Should call compare with correct value', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare('any_value', 'any_hashed_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', 'any_hashed_value')
    })

    test('Should return true on succes', async () => {
      const sut = makeSut()
      const isValid = await sut.compare('any_value', 'any_hashed_value')

      expect(isValid).toBe(true)
    })

    test('Should throw if bcrypt throws', async () => {
      const sut = makeSut();

      (bcrypt.compare as jest.Mock).mockRejectedValueOnce(new Error());

      await expect(sut.compare('any_value', 'any_hashed_value')).rejects.toThrow();
    })
  });
})