import type { RouteModel } from "../domain/models/route-model";
import type { RouteFowarded } from "../domain/usecases/route-fowarded";
import type { AxiosAdapter } from "../infra/http/axios-adapter";
import type { HttpRequest, HttpResponse } from "../presentation/protocols";

export class PublicRouteFowarded implements RouteFowarded {
  private readonly routeModel: RouteModel
  private readonly axiosAdapter: AxiosAdapter

  constructor(routeModel: RouteModel, axiosAdapter: AxiosAdapter) {
    this.routeModel = routeModel
    this.axiosAdapter = axiosAdapter
  }

  async route(request: HttpRequest): Promise<HttpResponse> {
    const httpRequest = {
      method: this.routeModel.method,
      url: this.routeModel.uri,
      body: request.body
    }
    
    const response = await this.axiosAdapter.request(httpRequest)
    return response
  }
}