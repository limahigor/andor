export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest<T = any> {
  headers?: {
    authorization?: string;
    [key: string]: any;
  };
  body?: T
}