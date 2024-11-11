import type { RouteFowarded } from "../../domain/usecases/route-fowarded";
import type { Controller, HttpRequest, HttpResponse } from "../protocols";
import { ok, serverError } from "../helpers/http-helper";

export class RouteController implements Controller{
  private readonly routeFowarded: RouteFowarded

  constructor(routeFowarded: RouteFowarded){
    this.routeFowarded = routeFowarded
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse>{
    try{
      const response = await this.routeFowarded.route(httpRequest)

      return ok(response.body)
    }catch(error){
      return serverError()
    }
    
  }
}