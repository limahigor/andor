import type { AxiosAdapter } from "../infra/http/axios-adapter"
import type { RouteModel } from "../domain/models/route-model"
import type { HttpRequest, HttpResponse } from "../presentation/protocols"
import { PrivateRouteFowarded } from "./private-route-fowarded"
import dotenv from "dotenv";

dotenv.config();

interface SutTypes {
  sut: PrivateRouteFowarded
  axiosAdapterStub: AxiosAdapter
}

const makeAxiosAdapterStub = (): AxiosAdapter => {
  class AxiosAdapterStub implements AxiosAdapter {
    httpRequest: HttpRequest
    result = {
      statusCode: 200,
      body: 'any_body'
    }

    async request(httpRequest: HttpRequest): Promise<HttpResponse> {
      this.httpRequest = httpRequest
      return this.result
    }
  }

  return new AxiosAdapterStub()
}

const makeSut = (route: RouteModel): SutTypes => {
  const axiosAdapterStub = makeAxiosAdapterStub()
  const sut = new PrivateRouteFowarded(route, axiosAdapterStub)

  return {
    sut,
    axiosAdapterStub
  }
}

describe("Private Route Fowarded", () => {
  test('Should return 404 if no hearder authorization is provided', async () => {
    const routeModel: RouteModel = {
      uri: "http://example.com/login",
      method: "POST",
      authorization: false,
    };

    const httpRequest: HttpRequest = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        username: "any_username",
        password: "any_password"
      },
    };

    const { sut } = makeSut(routeModel);

    const response = await sut.route(httpRequest);

    expect(response.statusCode).toBe(404)
  })

  test('Should return 404 if hearder authorization fails', async () => {
    const routeModel: RouteModel = {
      uri: "http://example.com/login",
      method: "POST",
      authorization: false,
    };

    const httpRequest: HttpRequest = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        username: "any_username",
        password: "any_password"
      },
    };

    const { sut, axiosAdapterStub } = makeSut(routeModel);

    jest.spyOn(axiosAdapterStub, "request")
      .mockResolvedValueOnce({
        statusCode: 200,
        body: { isValid: false, userId: '' },
      })
      .mockResolvedValueOnce({
        statusCode: 200,
        body: 'any_body',
      });

    const response = await sut.route(httpRequest);

    expect(response.statusCode).toBe(404)
  })

  test('Should AxiosAdapter with correct data', async () => {
    const routeModel: RouteModel = {
      uri: "http://example.com/login",
      method: "POST",
      authorization: false,
    };

    const httpRequest: HttpRequest = {
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer valid_token"
      },
      body: {
        username: "any_username",
        password: "any_password"
      },
    };

    const { sut, axiosAdapterStub } = makeSut(routeModel);

    jest.spyOn(axiosAdapterStub, "request")
      .mockResolvedValueOnce({
        statusCode: 200,
        body: { isValid: true, userId: { id: 'valid_id' } },
      })
      .mockResolvedValueOnce({
        statusCode: 200,
        body: 'any_body',
      });

    const axiosAdapterSpy = jest.spyOn(axiosAdapterStub, 'request')

    await sut.route(httpRequest);

    const expectedUrl = `${process.env.AUTH_SERVICE_URL ?? "http://localhost:4000"}/validate`;

    expect(axiosAdapterSpy).toHaveBeenNthCalledWith(1, {
      method: "POST",
      url: expectedUrl,
      body: 'valid_token',
    });
    expect(axiosAdapterSpy).toHaveBeenNthCalledWith(2, {
      method: routeModel.method,
      url: routeModel.uri,
      body: { ...httpRequest.body, userId: 'valid_id' },
    });

  });

  test("Should fowarded correctly", async () => {
    const routeModel: RouteModel = {
      uri: "http://example.com/login",
      method: "POST",
      authorization: false,
    };

    const httpRequest: HttpRequest = {
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer valid_token"
      },
      body: {
        username: "any_username",
        password: "any_password"
      },
    };

    const { sut, axiosAdapterStub } = makeSut(routeModel);

    jest.spyOn(axiosAdapterStub, "request")
      .mockResolvedValueOnce({
        statusCode: 200,
        body: { isValid: true, userId: 'valid_id' },
      })
      .mockResolvedValueOnce({
        statusCode: 200,
        body: 'any_body',
      });

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
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer valid_token"
      },
      body: {
        username: "any_username",
        password: "any_password"
      },
    };

    const { sut, axiosAdapterStub } = makeSut(routeModel);

    jest.spyOn(axiosAdapterStub, "request").mockRejectedValue(new Error())
    const response = sut.route(httpRequest)

    await expect(response).rejects.toThrow()
  });
});
