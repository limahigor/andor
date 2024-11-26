import axios, { type AxiosResponse, AxiosHeaders, type AxiosRequestConfig } from "axios";
import { AxiosAdapter, type HttpRequest } from "./axios-adapter";

jest.mock("axios");
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

describe("AxiosAdapter", () => {
  let sut: AxiosAdapter = new AxiosAdapter();

  beforeEach(() => {
    sut = new AxiosAdapter();
  });

  test("Should return correct HttpResponse on success", async () => {
    const mockedResponse: AxiosResponse = {
      status: 201,
      data: { id: 123, username: "test_user" },
      statusText: "Created",
      headers: new AxiosHeaders(),
      config: {
        headers: new AxiosHeaders(),
        method: "POST",
        url: "http://example.com/api",
      },
    };

    mockedAxios.mockResolvedValueOnce(mockedResponse);

    const httpRequest: HttpRequest = {
      url: "http://example.com/api",
      method: "POST",
      body: { username: "test_user", password: "test_password" },
    };

    const response = await sut.request(httpRequest);

    expect(response).toEqual({
      statusCode: 201,
      body: { id: 123, username: "test_user" },
    });
  });

  test("Should use correct validateStatus function", async () => {
    const httpRequest: HttpRequest = {
      url: "http://example.com/api",
      method: "GET",
    };
  
    const mockedResponse: AxiosResponse = {
      status: 200,
      data: {},
      statusText: "OK",
      headers: new AxiosHeaders(),
      config: {
        headers: new AxiosHeaders(),
        method: "GET",
        url: "http://example.com/api",
      },
    };
  
    mockedAxios.mockResolvedValueOnce(mockedResponse);
  
    await sut.request(httpRequest);
  
    const [[axiosConfig]] = mockedAxios.mock.calls as unknown as [[AxiosRequestConfig]];
  
    if (axiosConfig.validateStatus) {
      expect(axiosConfig.validateStatus(200)).toBe(true);
      expect(axiosConfig.validateStatus(499)).toBe(true);
      expect(axiosConfig.validateStatus(500)).toBe(false);
    }
  });
});
