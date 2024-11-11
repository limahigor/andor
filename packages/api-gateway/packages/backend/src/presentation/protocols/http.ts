export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest<T = any, U = any> {
  headers?: U
  body?: T
}