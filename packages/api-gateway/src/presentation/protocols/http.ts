export interface HttpResponse<T = unknown> {
  statusCode: number
  body: T
}

export interface HttpRequest {
  headers?: {
    authorization?: string;
    [key: string]: unknown;
  };
  body?: unknown
}