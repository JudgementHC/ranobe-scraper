import { RequestHandler } from 'express'
import { Logger } from 'tslog'
import { autoInjectable } from 'tsyringe'
import CoubService from '../services/Coub.service'
import UtilsService from '../services/shared/Utils.service'

@autoInjectable()
export default class CoubController {
  private logger = new Logger()

  constructor(private utils: UtilsService, private coubService: CoubService) {}

  downloadCoub(): RequestHandler {
    return async (req, res) => {
      try {
        await this.coubService.downloadCoub()
      } catch (err) {
        this.logger.error(err)
      }

      res.json()
    }
  }
}
