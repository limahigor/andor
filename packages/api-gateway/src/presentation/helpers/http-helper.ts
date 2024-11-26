import type { HttpResponse } from '../protocols/http'
import { ServerError } from '../errors'

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})

export const notFound = (): HttpResponse => ({
  statusCode: 404,
  body: ''
})