import { RequestHandler, Router } from 'express'
import DBmodelService from '../../services/DBmodel.service'

export interface IRanobeRouter {
  router: Router
}

export interface IRanobeController {
  dbModel: DBmodelService

  login(): RequestHandler
  getUserRanobeList(): RequestHandler
  getLocalRanobeList(): RequestHandler
  search(): RequestHandler
  getAvailableChapters(): RequestHandler
  getLocalChapters(): RequestHandler
  download(): RequestHandler
}

export interface DefaultService {
  baseUrl: string
}
