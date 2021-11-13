import { RequestHandler, Router } from 'express'
import DBmodelService from '../../services/shared/DBmodel.service'
import { IStartEnd } from './Common.interface'

export interface IRanobeRouter {
  router: Router
}

export interface IRanobeController {
  dbModel: DBmodelService

  search?(): RequestHandler
  chapters(): RequestHandler
  download(): RequestHandler
}

export interface IRanobeService {
  baseUrl: string

  parseLink(link: string): any
  getChaptersRange(hrefList: string[]): IStartEnd
}
