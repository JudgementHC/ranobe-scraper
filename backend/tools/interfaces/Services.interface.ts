import { RequestHandler, Router } from 'express'
import DBmodelService from '../../services/shared/DBmodel.service'

export interface IRanobeRouter {
  router: Router
}

export interface IRanobeController {
  dbModel: DBmodelService

  search(): RequestHandler
  chapters(): RequestHandler
  download(): RequestHandler
}

export interface IDefaultService {
  baseUrl: string
}
