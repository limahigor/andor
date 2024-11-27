import { MissingParamError } from "../../errors";
import type { HttpRequest } from "../../protocols";
import { ValidateTokenController } from "./validate-token-controller";
import type { ValidateRequest, ValidateResult, ValidateToken } from "./validate-token-controller-protocols";


interface SutTypes {
  sut: ValidateTokenController
  validateAccountStub: ValidateTokenStubWithResult
}

interface ValidateTokenStubWithResult extends ValidateToken {
  result: ValidateResult;
}

const makeValidateAccountStub = (): ValidateTokenStubWithResult => {
  class ValidateTokenStub implements ValidateTokenStubWithResult {
    result: ValidateResult = {
      isValid: true,
      userId: 'valid_id',
    };

    async validate(token: string): Promise<ValidateResult> {
      return this.result;
    }
  }

  return new ValidateTokenStub()
}

const makeSut = (): SutTypes => {
  const validateAccountStub = makeValidateAccountStub()
  const sut = new ValidateTokenController(validateAccountStub)

  return { sut, validateAccountStub }
}

describe('Validate Token Controller', () => {
  test('Should return true if token is valid', async () => {
    const { sut } = makeSut();

    const httpRequest: HttpRequest<ValidateRequest> = {
      body: {
        token: 'valid_token',
      },
    };

    const result = await sut.handle(httpRequest);

    if ('isValid' in result.body && 'userId' in result.body) {
      expect(result.body.isValid).toBe(true);
      expect(result.body.userId).toBe('valid_id');
    } else {
      throw new Error('Unexpected response body');
    }
  });

  test('Should return 400 if no token is provided', async () => {
    const { sut } = makeSut();

    const httpRequest: HttpRequest<ValidateRequest> = {
      body: {}
    };

    const result = await sut.handle(httpRequest)

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual(new MissingParamError('token'))
  });

  test('Should ValidateToken call with correct data', async () => {
    const { sut, validateAccountStub } = makeSut();
    const validateAccountSpy = jest.spyOn(validateAccountStub, 'validate')

    const httpRequest: HttpRequest<ValidateRequest> = {
      body: {
        token: 'valid_token',
      }
    };

    await sut.handle(httpRequest)

    expect(validateAccountSpy).toHaveBeenCalledWith('valid_token')
  });

  test('Should return 401 if ValidateToken throws', async () => {
    const { sut, validateAccountStub } = makeSut();
    jest.spyOn(validateAccountStub, 'validate').mockImplementationOnce(async () => await Promise.reject(new Error()))

    const httpRequest: HttpRequest<ValidateRequest> = {
      body: {
        token: 'valid_token',
      }
    };

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      isValid: false,
      userId: ''
    })
  });

  test('Should return 400 if body is undefined', async () => {
    const { sut } = makeSut();

    const httpRequest: HttpRequest<ValidateRequest> = {};
    const result = await sut.handle(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(new MissingParamError('token'));
  });
});