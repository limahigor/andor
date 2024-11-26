import "dotenv/config"
import { PublicRouteFowarded } from "../../data/public-route-fowarded"
import type { RouteModel } from "../../domain/models/route-model"
import { AxiosAdapter } from "../../infra/http/axios-adapter"
import { RouteController } from "../../presentation/controllers/route-controller"

export const makePublicRouteController = (routeModel : RouteModel): RouteController => {
  const axiosAdapter = new AxiosAdapter()
  const routeFowarded = new PublicRouteFowarded(routeModel, axiosAdapter)

  return new RouteController(routeFowarded)
}
