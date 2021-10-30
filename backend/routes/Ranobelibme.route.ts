import { Router } from 'express'
import 'reflect-metadata'
import { autoInjectable, container } from 'tsyringe'
import RanobeLibMeController from '../controllers/Ranobelibme.controller'
import { IRanobeRouter } from '../tools/interfaces/RanobeService.interface'

/*
  path: /ranobelibme
*/

// todo: необходимо добавить type message, чтобы отправлять ошибки с бекенда на фронт
// todo: добавь возможность прерывания процесса chromium, когда axios с фронта прекращает запрос
@autoInjectable()
class RanobeLibMeRouter implements IRanobeRouter {
  router: Router = Router()

  constructor(private ranobelibmeController: RanobeLibMeController) {
    this.router.get('/search', this.ranobelibmeController.search())

    this.router.get('/chapters', this.ranobelibmeController.chapters())

    this.router.post('/download', this.ranobelibmeController.download())

    this.router.get('/ranobeList', this.ranobelibmeController.ranobeList())
  }
}

export default container.resolve(RanobeLibMeRouter)
