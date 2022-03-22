import { Router } from 'express'
import 'reflect-metadata'
import { autoInjectable, container } from 'tsyringe'
import CoubController from '../controllers/Coub.controller'

/*
  path: /coub
*/

@autoInjectable()
class Coub {
  router: Router = Router()

  constructor(private coubController: CoubController) {
    this.router.get('/', this.coubController.downloadCoub())
  }
}

export default container.resolve(Coub)
