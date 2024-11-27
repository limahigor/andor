import type { RouteModel } from "../domain/models/route-model";
import type { RouteFowarded } from "../domain/usecases/route-fowarded";
import type { AxiosAdapter } from "../infra/http/axios-adapter";
import { notFound } from "../presentation/helpers/http-helper";
import type { HttpRequest, HttpResponse } from "../presentation/protocols";
import dotenv from "dotenv";

dotenv.config();

const authServiceUrl: string = process.env.AUTH_SERVICE_URL ?? "http://localhost:5050"

export interface AuthResponseBody {
  isValid: boolean;
  userId: {
    id: string
  }
}

export class PrivateRouteFowarded implements RouteFowarded {
  private readonly routeModel: RouteModel
  private readonly axiosAdapter: AxiosAdapter

  constructor(routeModel: RouteModel, axiosAdapter: AxiosAdapter) {
    this.routeModel = routeModel
    this.axiosAdapter = axiosAdapter
  }

  async route(request: HttpRequest): Promise<HttpResponse> {
    const authorizationHeader = request.headers?.authorization
    
    if (!authorizationHeader) {
      return notFound();
    }
    
    const token = authorizationHeader.replace("Bearer ", "");
    
    const authRequest = {
      method: "POST",
      url: `${authServiceUrl}/api/validate`, // Construção dinâmica da URL
      body: {token},
    }
    
    const responseAuthRequest = await this.axiosAdapter.request<AuthResponseBody>(authRequest);
    
    if (responseAuthRequest.statusCode === 200 && responseAuthRequest.body.isValid) {
      const { body } = responseAuthRequest;
      const { userId } = body
      const { id } = userId
      
      const bodyRequest = typeof request.body === "object" && request.body !== null
      ? { ...request.body, userId: id }
      : { userId: id };
      
      const httpRequest = {
        method: this.routeModel.method,
        url: this.routeModel.uri,
        body: bodyRequest,
      };
      
      const response = await this.axiosAdapter.request(httpRequest);
      return response;
    } else {
      return notFound();
    }
  }
  
}