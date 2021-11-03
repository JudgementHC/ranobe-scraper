import { Router } from 'express'
import 'reflect-metadata'
import { autoInjectable, container } from 'tsyringe'
import InfinitenoveltranslationsController from '../controllers/Infinitenoveltranslations.controller'
import { IRanobeRouter } from '../tools/interfaces/Services.interface'

/*
  path: /infinitenoveltranslations
*/

@autoInjectable()
class Infinitenoveltranslations implements IRanobeRouter {
  router: Router = Router()

  constructor(
    private infinitenoveltranslationsController: InfinitenoveltranslationsController
  ) {
    this.router.get(
      '/search',
      this.infinitenoveltranslationsController.search()
    )

    this.router.get(
      '/chapters',
      this.infinitenoveltranslationsController.chapters()
    )

    this.router.post(
      '/download',
      this.infinitenoveltranslationsController.download()
    )

    this.router.get(
      '/ranobeList',
      this.infinitenoveltranslationsController.ranobeList()
    )
  }
}

export default container.resolve(Infinitenoveltranslations)
