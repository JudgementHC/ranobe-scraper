import { Router } from 'express'
import 'reflect-metadata'
import { Logger } from 'tslog'
import { autoInjectable, container } from 'tsyringe'
import { v4 } from 'uuid'
import UtilsService from '../services/shared/Utils.service'
import { IRanobeRouter } from '../tools/interfaces/Services.interface'

/*
  path: /test
*/

@autoInjectable()
class TestRouter implements IRanobeRouter {
  router: Router = Router()
  logger = new Logger()

  constructor(private utils: UtilsService) {
    this.router.get('/search', async (req, res) => {
      const connectionUid = v4()

      const [page] = await this.utils.getPuppeeterStealth(connectionUid)

      req.on('close', () => {
        this.utils.removeProcess(connectionUid)
      })

      try {
        await new Promise(res => {
          setTimeout(res, 5000)
        })

        await page.goto('https://jsonplaceholder.typicode.com/', {
          waitUntil: 'domcontentloaded'
        })
      } catch (err) {
        this.logger.error(err)
      } finally {
        await this.utils.removeProcess(connectionUid)
      }

      res.json('ok')
    })
  }
}

export default container.resolve(TestRouter)
