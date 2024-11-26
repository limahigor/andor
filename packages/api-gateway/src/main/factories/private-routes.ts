import "dotenv/config"
import type { RouteModel } from "../../domain/models/route-model"
import { AxiosAdapter } from "../../infra/http/axios-adapter"
import { RouteController } from "../../presentation/controllers/route-controller"
import { PrivateRouteFowarded } from "../../data/private-route-fowarded"

export const makePrivateRouteController = (routeModel : RouteModel): RouteController => {
  const axiosAdapter = new AxiosAdapter()
  const routeFowarded = new PrivateRouteFowarded(routeModel, axiosAdapter)

  return new RouteController(routeFowarded)
}