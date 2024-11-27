import axios, { type AxiosRequestConfig } from "axios";

export interface AxiosHttpRequest {
  url: string;
  method: string;
  headers?: unknown;
  body?: unknown;
  params?: unknown;
}

export interface AxiosHttpResponse<T = unknown> {
  statusCode: number;
  body: T;
}

export class AxiosAdapter {
  async request<T = unknown>(data: AxiosHttpRequest): Promise<AxiosHttpResponse<T>> {
    const axiosConfig: AxiosRequestConfig = {
      url: data.url,
      method: data.method,
      data: data.body,
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      },
    }; 

    
    const axiosResponse = await axios.request<T>(axiosConfig);

    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    };
  }
}
