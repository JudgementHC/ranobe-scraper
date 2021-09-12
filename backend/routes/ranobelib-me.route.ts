import { Router } from 'express'
import 'reflect-metadata'
import { autoInjectable, container } from 'tsyringe'
import RanobeLibMeController from '../controllers/ranobelib-me.controller'
import { isAuthorized } from '../middlewares/ranobelib-me.middleware'
import { IRanobeRouter } from '../tools/interfaces/RanobeService.interface'

/*
  path: /ranobelibme
*/

@autoInjectable()
class RanobeLibMeRouter implements IRanobeRouter {
  router: Router = Router()

  constructor(private ranobelibmeController: RanobeLibMeController) {
    this.router.post('/login', this.ranobelibmeController.login())

    this.router.get(
      '/getUserRanobeList',
      isAuthorized,
      this.ranobelibmeController.getUserRanobeList()
    )

    this.router.get(
      '/localRanobeList',
      this.ranobelibmeController.getLocalRanobeList()
    )
  }
}

export default container.resolve(RanobeLibMeRouter)
