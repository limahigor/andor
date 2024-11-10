import type { Controller, HttpRequest } from "../../presentation/protocols";
import type { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => async (req: Request, res: Response) => {
  const httpRequest: HttpRequest = {
    body: req.body
  }

  console.log('teste')
  console.log(req)

  const httpResponse = await controller.handle(httpRequest)
  res.status(httpResponse.statusCode).json(httpResponse.body)
 }