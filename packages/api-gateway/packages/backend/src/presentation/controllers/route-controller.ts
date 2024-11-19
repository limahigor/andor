import type { RouteFowarded } from "../../domain/usecases/route-fowarded";
import { serverError } from "../helpers/http-helper";
import type { Controller, HttpRequest, HttpResponse } from "../protocols";

export class RouteController implements Controller{
  private readonly routeFowarded: RouteFowarded

  constructor(routeFowarded: RouteFowarded){
    this.routeFowarded = routeFowarded
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse>{
    try{

      const response = await this.routeFowarded.route(httpRequest)

      return response
    }catch(error){
      return serverError()
    }
    
  }
}