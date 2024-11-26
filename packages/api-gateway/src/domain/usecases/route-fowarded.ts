import type { HttpRequest, HttpResponse } from "../../presentation/protocols";

export interface RouteFowarded {
  route: (request: HttpRequest) => Promise<HttpResponse>;
}