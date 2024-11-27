import type { HttpResponse } from '../protocols/http'
import { ServerError } from '../errors'
import type { ValidateResult } from '../controllers/token/validate-token-controller-protocols'

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  body: error
})

export const serverError = (): HttpResponse<Error> => ({
  statusCode: 500,
  body: new ServerError()
})

export const ok = <T>(data: T): HttpResponse<T> => ({
  statusCode: 200,
  body: data,
});

export const unauthorized = (): HttpResponse<ValidateResult> => ({
  statusCode: 401,
  body: {
    isValid: false,
    userId: ''
  }
})