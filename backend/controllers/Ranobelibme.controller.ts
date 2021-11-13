import { RequestHandler } from 'express'
import fs from 'fs'
import { Logger } from 'tslog'
import { autoInjectable } from 'tsyringe'
import RanobelibmeService from '../services/Ranobelibme.service'
import TempDBService from '../services/shared/ChaptersDB.service'
import DBmodelService from '../services/shared/DBmodel.service'
import EpubGenService from '../services/shared/EpubGen.service'
import UtilsService from '../services/shared/Utils.service'
import { ERanobeServices } from '../tools/enums/Services.enum'
import {
  IChaptersQuery,
  IDownloadQuery,
  IGetChapters,
  IReaderContainer,
  ISearchQuery,
  IUserListQuery
} from '../tools/interfaces/Ranobelibme.interface'
import { IEpubMetaData, IRanobe } from '../tools/interfaces/Common.interface'
import { IRanobeController } from '../tools/interfaces/Services.interface'

@autoInjectable()
export default class RanobelibmeController implements IRanobeController {
  dbModel: DBmodelService
  private logger = new Logger()

  constructor(
    private ranobeLibMeService: RanobelibmeService,
    private tempDBService: TempDBService,
    private utils: UtilsService
  ) {
    this.dbModel = new DBmodelService(ERanobeServices.RANOBELIBME)
  }

  ranobeList(): RequestHandler {
    return async (req, res) => {
      const { userId, local } = req.query as unknown as IUserListQuery
      let data: IRanobe[] | undefined = []

      if (local) {
        data = this.dbModel.getLocalList()
      } else if (userId) {
        data = await this.ranobeLibMeService.getRanobeList(userId)
      }

      if (data) {
        try {
          this.dbModel.setLocalList(data)
        } catch (error) {
          this.logger.error(error)
        }
        return res.json(data)
      }

      res.sendStatus(500)
    }
  }

  search(): RequestHandler {
    return async (req, res) => {
      const { title, type } = req.query as unknown as ISearchQuery

      if (title && type) {
        const data = await this.ranobeLibMeService.search(title, type)

        return res.json(data)
      }

      res.sendStatus(500)
    }
  }

  chapters(): RequestHandler {
    return async (req, res) => {
      const { title, href, reload, translate } =
        req.query as unknown as IChaptersQuery

      if (href) {
        if (!reload) {
          const ranobe = await this.dbModel.getChapters(title)

          if (ranobe) {
            return res.json({ chapters: ranobe })
          }
        }

        const data = await this.ranobeLibMeService.getChapters(href, translate)
        const dataT = data as IGetChapters
        if (title && dataT.chapters?.[0]?.title) {
          await this.dbModel.setChapters(
            title,
            dataT.chapters,
            href,
            dataT.cover
          )
        }
        return res.json(data)
      }

      res.sendStatus(500)
    }
  }

  download(): RequestHandler {
    return async (req, res) => {
      const { title, ranobeHrefList, reload } = req.body as IDownloadQuery

      const { start, end } =
        this.ranobeLibMeService.getChaptersRange(ranobeHrefList)

      const fileName = this.utils.tempRanobePattern(title, start, end)

      try {
        let file
        if (!reload && fs.existsSync(fileName)) {
          file = JSON.parse(fs.readFileSync(fileName).toString())
        }

        let readerContainer: IReaderContainer[]

        if (!file) {
          readerContainer = await this.ranobeLibMeService.download(
            ranobeHrefList
          )
        } else {
          readerContainer = file
        }

        const metadata: IEpubMetaData = {
          title,
          cover: 'cover.jpg',
          images: []
        }

        await this.tempDBService.saveRanobeData(
          { title, start, end },
          readerContainer
        )

        const epubGenService = new EpubGenService(
          metadata,
          readerContainer,
          start,
          end
        )

        const [filePath, filename] = await epubGenService.generate()

        return res.sendFile(filePath, {
          fileName: filename
        })
      } catch (error) {
        this.logger.error(error as Error)
      }

      res.sendStatus(500)
    }
  }
}
