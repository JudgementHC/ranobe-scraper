import { Router } from 'express'
import 'reflect-metadata'
import { autoInjectable, container } from 'tsyringe'
import RanobeLibMeController from '../controllers/ranobelib-me.controller'
import { isAuthorized } from '../middlewares/ranobelib-me.middleware'
import { IRanobeRouter } from '../tools/interfaces/RanobeService.interface'

/*
  path: /ranobelibme
*/

// todo: необходимо добавить type message, чтобы отправлять ошибки с бекенда на фронт
@autoInjectable()
class RanobeLibMeRouter implements IRanobeRouter {
  router: Router = Router()

  constructor(private ranobelibmeController: RanobeLibMeController) {
    this.router.post('/login', this.ranobelibmeController.login())

    this.router.get(
      '/userRanobeList',
      isAuthorized,
      this.ranobelibmeController.getUserRanobeList()
    )

    this.router.get(
      '/localRanobeList',
      this.ranobelibmeController.getLocalRanobeList()
    )

    this.router.get('/search', this.ranobelibmeController.search())

    this.router.get(
      '/availableChapters',
      this.ranobelibmeController.getAvailableChapters()
    )
  }
}

export default container.resolve(RanobeLibMeRouter)
