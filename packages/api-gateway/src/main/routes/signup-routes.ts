import type { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import dotenv from "dotenv";
import { makePrivateRouteController } from "../factories/private-routes";

dotenv.config();
const authServiceUrl: string = process.env.AUTH_SERVICE_URL ?? "http://localhost:5050"

export default (router: Router): void => {
  const routeModel = {
    uri: `${authServiceUrl}/api/signup`,
    method: "POST",
    authorization: false
  }
  router.post('/signup', adaptRoute(makePrivateRouteController(routeModel)))
}