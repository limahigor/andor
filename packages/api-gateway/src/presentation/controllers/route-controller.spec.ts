import { RouteController } from "./route-controller"
import type { HttpRequest, HttpResponse, RouteFowarded } from "./route-protocols"

interface SutTypes {
  sut: RouteController
  routeFowardedStub: RouteFowarded
}

const makeRouteFowardedStub = (): RouteFowarded => {
  class RouteFowardedStub implements RouteFowarded {
    httpRequest: HttpRequest
    result = {
      statusCode: 200,
      body: 'any_body'
    }

    async route(httpRequest: HttpRequest): Promise<HttpResponse> {
      this.httpRequest = httpRequest
      return this.result
    }
  }

  return new RouteFowardedStub()
}

const makeSut = (): SutTypes => {
  const routeFowardedStub = makeRouteFowardedStub()
  const sut = new RouteController(routeFowardedStub)

  return {
    sut,
    routeFowardedStub
  }
}

describe('Public Routes Controller', () => {
  test('Should call RouteFowarded with correct data', async () => {
    const { sut, routeFowardedStub } = makeSut()

    const routeFowardedSpy = jest.spyOn(routeFowardedStub, 'route')

    const httpRequest: HttpRequest = {
      body: 'any_body'
    };

    await sut.handle(httpRequest)

    expect(routeFowardedSpy).toHaveBeenCalledWith(httpRequest)
  });

  test('Should return 200 if RouteFowarded return 200', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: 'any_body'
    };

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(200)
    expect(response.body).toBe('any_body')
  });

  test('Should return 500 if RouteFowarded throws', async () => {
    const { sut, routeFowardedStub } = makeSut()

    jest.spyOn(routeFowardedStub, 'route').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest: HttpRequest = {
      body: 'any_body'
    };

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(500)
  });
});