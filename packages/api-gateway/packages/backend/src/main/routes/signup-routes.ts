import type { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import dotenv from "dotenv";
import { makePublicRouteController } from "../factories/public-routes";

dotenv.config();
const authServiceUrl: string = process.env.AUTH_SERVICE_URL ?? "http://localhost:4000"

export default (router: Router): void => {
  const routeModel = {
    uri: `${authServiceUrl}/api/signup`,
    method: "POST",
    authorization: false
  }
  router.post('/signup', adaptRoute(makePublicRouteController(routeModel)))
}