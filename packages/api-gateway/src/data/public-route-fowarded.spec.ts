import type { AxiosAdapter, AxiosHttpRequest, AxiosHttpResponse } from "../infra/http/axios-adapter"
import { PublicRouteFowarded } from "./public-route-fowarded"
import type { RouteModel } from "../domain/models/route-model"
import type { HttpRequest } from "../presentation/protocols"

interface SutTypes {
  sut: PublicRouteFowarded
  axiosAdapterStub: AxiosAdapter
}

const makeAxiosAdapterStub = (): AxiosAdapter => {
  class AxiosAdapterStub implements AxiosAdapter {
    httpRequest: AxiosHttpRequest;
    result: AxiosHttpResponse<string> = {
      statusCode: 200,
      body: 'any_body',
    };

    async request<T = string>(httpRequest: AxiosHttpRequest): Promise<AxiosHttpResponse<T>> {
      this.httpRequest = httpRequest;
      return this.result as AxiosHttpResponse<T>;
    }
  }

  return new AxiosAdapterStub();
};

const makeSut = (route: RouteModel): SutTypes => {
  const axiosAdapterStub = makeAxiosAdapterStub()
  const sut = new PublicRouteFowarded(route, axiosAdapterStub)

  return {
    sut,
    axiosAdapterStub
  }
}

describe("PublicRouteFowarded", () => {
  test('Should AxiosAdapter with correct data', async () => {
    const routeModel: RouteModel = {
      uri: "http://localhost:8080/login",
      method: "POST",
      authorization: false,
    };

    const httpRequest: HttpRequest = {
      headers: { "Content-Type": "application/json" },
      body: { email: "test@example.com", password: "123456" },
    };

    const { sut, axiosAdapterStub } = makeSut(routeModel);

    const axiosAdapterSpy = jest.spyOn(axiosAdapterStub, 'request')

    await sut.route(httpRequest);

    expect(axiosAdapterSpy).toHaveBeenCalledWith({
      method: routeModel.method,
      url: routeModel.uri,
      body: httpRequest.body
    })
  });

  test("Should fowarded correctly", async () => {
    const routeModel: RouteModel = {
      uri: "http://example.com/login",
      method: "POST",
      authorization: false,
    };

    const httpRequest: HttpRequest = {
      body: { username: "any_username", password: "any_password" },
    };

    const { sut } = makeSut(routeModel);

    const response = await sut.route(httpRequest);

    expect(response).toEqual({
      statusCode: 200,
      body: "any_body",
    });
  });

  test("Should throw if AxiosAdapter throws", async () => {
    const routeModel: RouteModel = {
      uri: "http://example.com/login",
      method: "POST",
      authorization: false,
    };

    const httpRequest: HttpRequest = {
      body: { username: "any_username", password: "any_password" },
    };

    const { sut, axiosAdapterStub } = makeSut(routeModel);

    jest.spyOn(axiosAdapterStub, "request").mockRejectedValue(new Error())
    const response = sut.route(httpRequest)

    await expect(response).rejects.toThrow()
  });
});
