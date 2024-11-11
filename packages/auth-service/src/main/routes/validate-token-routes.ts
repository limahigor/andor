import type { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import { makeValidateController } from "../factories/validate";

export default (router: Router): void => {
  router.post('/validate', adaptRoute(makeValidateController()))
}