import type { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import dotenv from "dotenv";
import { makePublicRouteController } from "../factories/public-routes";

dotenv.config();
const authServiceUrl: string = process.env.AUTH_SERVICE_URL ?? "http://localhost:5050"

export default (router: Router): void => {
  const routeModel = {
    uri: `${authServiceUrl}/api/login`,
    method: "POST",
    authorization: false
  }
  router.post('/login', adaptRoute(makePublicRouteController(routeModel)))
}