import type { Controller, HttpRequest } from "../../presentation/protocols";
import type { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => async (req: Request, res: Response) => {
  const httpRequest: HttpRequest = {
    body: req.body
  }
  const httpResponse = await controller.handle(httpRequest)
  console.log(httpRequest.body)
  console.log(httpResponse.body)
  res.status(httpResponse.statusCode).json(httpResponse.body)
 }