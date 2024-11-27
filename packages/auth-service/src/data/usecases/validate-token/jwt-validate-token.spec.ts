import type { Decrypter } from '../../protocols';
import type { TokenResult } from './helpers/helper-validate';
import { JwtValidateToken } from './jwt-validate-token';

interface SutTypes {
  sut: JwtValidateToken
  decrypterStub: Decrypter
}

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<TokenResult> {
      return { id: 'valid_id', iat: 0 }
    }
  }

  return new DecrypterStub
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const sut = new JwtValidateToken(decrypterStub);

  return {
    sut,
    decrypterStub
  }
};

describe('JwtValidateToken', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();
    const verifySpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.validate('any_token');

    expect(verifySpy).toHaveBeenCalledWith('any_token');
  });

  test('Should return isValid true and userId if Decrypter returns a valid payload', async () => {
    const { sut } = makeSut();

    const result = await sut.validate('valid_token');

    expect(result).toEqual({ isValid: true, userId: 'valid_id' });
  });

  test('Should return isValid as false if jwt.verify returns null', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValue({id: '', iat: 0});

    const result = await sut.validate('any_token');

    expect(result).toEqual({ isValid: false, userId: '' });
  });

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.validate('any_token')).rejects.toThrow(new Error());
  });
});
