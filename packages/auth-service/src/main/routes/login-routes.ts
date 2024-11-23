import type { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import { makeLoginController } from "../factories/login";

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()))
}