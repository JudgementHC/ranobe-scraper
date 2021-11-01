import { Router } from 'express'
import 'reflect-metadata'
import { autoInjectable, container } from 'tsyringe'
import RanobelibmeController from '../controllers/Ranobelibme.controller'
import RanobelibmeService from '../services/Ranobelibme.service'
import { IRanobeRouter } from '../tools/interfaces/Services.interface'

/*
  path: /ranobelibme
*/

// todo: необходимо добавить type message, чтобы отправлять ошибки с бекенда на фронт
// todo: добавь возможность прерывания процесса chromium, когда axios с фронта прекращает запрос
@autoInjectable()
class RanobelibmeRouter implements IRanobeRouter {
  router: Router = Router()

  constructor(
    private ranobelibmeController: RanobelibmeController,
    private service: RanobelibmeService
  ) {
    this.router.get('/search', this.ranobelibmeController.search())

    this.router.get('/chapters', this.ranobelibmeController.chapters())

    this.router.post('/download', this.ranobelibmeController.download())

    this.router.get('/ranobeList', this.ranobelibmeController.ranobeList())

    this.router.get('/login', async (req, res) => {
      await this.service.login()
      res.sendStatus(200)
    })
  }
}

export default container.resolve(RanobelibmeRouter)
