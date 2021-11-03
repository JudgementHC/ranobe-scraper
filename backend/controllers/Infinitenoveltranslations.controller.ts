import { RequestHandler } from 'express'
import { Logger } from 'tslog'
import { autoInjectable } from 'tsyringe'
import InfinitenoveltranslationsService from '../services/Infinitenoveltranslations.service'
import TempDBService from '../services/shared/ChaptersDB.service'
import DBmodelService from '../services/shared/DBmodel.service'
import UtilsService from '../services/shared/Utils.service'
import { ERanobeServices } from '../tools/enums/Services.enum'
import { IRanobeController } from '../tools/interfaces/Services.interface'

@autoInjectable()
export default class InfinitenoveltranslationsController
  implements IRanobeController
{
  dbModel: DBmodelService
  private logger = new Logger()

  constructor(
    private infinitenoveltranslationsService: InfinitenoveltranslationsService,
    private tempDBService: TempDBService,
    private utils: UtilsService
  ) {
    this.dbModel = new DBmodelService(ERanobeServices.RANOBELIBME)
  }

  ranobeList(): RequestHandler {
    return async (req, res) => {
      try {
        const ranobeList =
          await this.infinitenoveltranslationsService.ranobeList()
        return res.json(ranobeList)
      } catch (error) {
        this.logger.error(error)
      }

      res.sendStatus(404)
    }
  }

  search(): RequestHandler {
    return async (req, res) => {
      res.sendStatus(404)
    }
  }

  chapters(): RequestHandler {
    return async (req, res) => {
      res.sendStatus(404)
    }
  }

  download(): RequestHandler {
    return async (req, res) => {
      res.sendStatus(404)
    }
  }
}
