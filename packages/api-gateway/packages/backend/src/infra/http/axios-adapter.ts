import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

export interface HttpRequest {
  url: string;
  method: string;
  headers?: any;
  body?: any;
  params?: any;
}

export interface HttpResponse<T = any> {
  statusCode: number;
  body: T;
}

export class AxiosAdapter {
  async request<T = any>(data: HttpRequest): Promise<HttpResponse<T>> {
    const axiosConfig: AxiosRequestConfig = {
      url: data.url,
      method: data.method,
      data: data.body,
    };

    const axiosResponse: AxiosResponse = await axios(axiosConfig);

    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    };
  }
}
