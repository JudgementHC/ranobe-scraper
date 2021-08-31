import { RequestHandler, Router } from 'express'

export interface IRanobeRouter {
  router: Router
}

export interface IRanobeController {
  login(): RequestHandler
  getUserRanobeList(): RequestHandler
}

export interface DefaultService {
  baseUrl: string
}
