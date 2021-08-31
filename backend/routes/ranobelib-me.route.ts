import { Router } from 'express'
import 'reflect-metadata'
import { autoInjectable, container } from 'tsyringe'
import RanobeLibMeController from '../controllers/ranobelib-me.controller'
import { IRanobeRouter } from '../tools/interfaces/RanobeService.interface'
import { isAuthorized } from '../middlewares/authentication'

/* /ranobelibme */

@autoInjectable()
class RanobeLibMeRouter implements IRanobeRouter {
  router: Router = Router()

  constructor(public ranobelibmeController: RanobeLibMeController) {
    this.router.post('/login', this.ranobelibmeController.login())

    this.router.get(
      '/getUserRanobeList',
      isAuthorized,
      this.ranobelibmeController.getUserRanobeList()
    )
  }
}

export default container.resolve(RanobeLibMeRouter)
