import { RequestHandler } from 'express'
import { Logger } from 'tslog'
import { autoInjectable } from 'tsyringe'
import InfinitenoveltranslationsService from '../services/Infinitenoveltranslations.service'
import TempDBService from '../services/shared/ChaptersDB.service'
import DBmodelService from '../services/shared/DBmodel.service'
import UtilsService from '../services/shared/Utils.service'
import { ERanobeServices } from '../tools/enums/Services.enum'
import {
  IDefaultChaptersQuery,
  IRanobe
} from '../tools/interfaces/Common.interface'
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
    this.dbModel = new DBmodelService(ERanobeServices.INFINITENOVELTRANSLATIONS)
  }

  ranobeList(): RequestHandler {
    return async (req, res) => {
      try {
        const localList = this.dbModel.getLocalList()
        if (localList.length) {
          return res.json(localList)
        }
      } catch (error) {
        this.logger.error(error)
      }

      let ranobeList: IRanobe[] = []

      try {
        ranobeList = await this.infinitenoveltranslationsService.ranobeList()
      } catch (error) {
        this.logger.error(error)
      }

      if (ranobeList.length) {
        try {
          await this.dbModel.setLocalList(ranobeList)
        } catch (error) {
          this.logger.error(error)
        }

        return res.json(ranobeList)
      }

      res.sendStatus(500)
    }
  }

  chapters(): RequestHandler {
    return async (req, res) => {
      const { href, title, reload } = req.body as IDefaultChaptersQuery

      res.sendStatus(500)
    }
  }

  download(): RequestHandler {
    return async (req, res) => {
      res.sendStatus(500)
    }
  }
}
