import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

export interface HttpRequest {
  url: string;
  method: string;
  headers?: any;
  body?: any;
  params?: any;
}

export interface HttpResponse {
  statusCode: number;
  body: any;
}

export class AxiosAdapter {
  async request(data: HttpRequest): Promise<HttpResponse> {
    const axiosConfig: AxiosRequestConfig = {
      url: data.url,
      method: data.method,
      data: data.body,
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      },
    };

    const axiosResponse: AxiosResponse = await axios(axiosConfig);

    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    };
  }
}
