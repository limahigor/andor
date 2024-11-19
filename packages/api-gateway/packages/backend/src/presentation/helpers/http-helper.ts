import type { HttpResponse } from '../protocols/http'
import { ServerError } from '../errors'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: {
    isValid: false,
    userId: ''
  }
})

export const notFound = (): HttpResponse => ({
  statusCode: 404,
  body: ''
})