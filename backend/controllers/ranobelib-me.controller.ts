import { RequestHandler } from 'express'
import fs from 'fs'
import { Logger } from 'tslog'
import { autoInjectable } from 'tsyringe'
import DBmodelService from '../services/DBmodel.service'
import EpubGenService, { IEpubMetaData } from '../services/epub-gen.service'
import RanobeLibMeService, {
  ILoginForm,
  TSearchType
} from '../services/ranobelib-me.service'
import TempDBService from '../services/temp-db.service'
import UtilsService from '../services/utils.service'
import { IRanobeController } from '../tools/interfaces/RanobeService.interface'
import { IRanobe, IUser } from '../tools/interfaces/User.interface'
import { IReaderContainer } from '../tools/service-responses/ranobelib-me.response'

@autoInjectable()
export default class RanobeLibMeController implements IRanobeController {
  dbModel: DBmodelService
  private logger = new Logger()

  constructor(
    private ranobeLibMeService: RanobeLibMeService,
    private tempDBService: TempDBService,
    private utils: UtilsService
  ) {
    this.dbModel = new DBmodelService('RANOBELIBME')
  }

  login(): RequestHandler {
    return async (req, res) => {
      try {
        const loginForm = req.body as ILoginForm

        if (loginForm.email && loginForm.password) {
          const [cookies, identifier, ranobeList] =
            await this.ranobeLibMeService.login(loginForm)

          cookies.forEach((cookie, index) => {
            res.setHeader(`ranobelib-auth_${index}`, JSON.stringify(cookie))
          })

          const user: IUser = {
            email: loginForm.email,
            identifier,
            ranobeList,
            domain: cookies[0].domain
          }

          await this.dbModel.setLocalUser(user)

          return res.json(user)
        }
      } catch (error) {
        res.sendStatus(500)
      }
    }
  }

  ranobeList(): RequestHandler {
    return async (req, res) => {
      type TUserListQuery = {
        userId: number
        local: boolean
      }
      const { userId, local } = req.query as unknown as TUserListQuery
      let data: IRanobe[] | undefined = []

      if (local) {
        data = this.dbModel.getLocalList()
      } else if (userId) {
        data = await this.ranobeLibMeService.getRanobeList(userId)
      }

      if (data) {
        return res.json(data)
      }

      res.sendStatus(500)
    }
  }

  search(): RequestHandler {
    return async (req, res) => {
      type TSearchQuery = {
        title: string
        type: TSearchType
      }
      const { title, type } = req.query as TSearchQuery

      if (title && type) {
        const data = await this.ranobeLibMeService.search(title, type)

        return res.json(data)
      }

      res.sendStatus(500)
    }
  }

  chapters(): RequestHandler {
    return async (req, res) => {
      type TChaptersQuery = {
        title: string
        href: string
        reload: boolean
      }

      const { title, href, reload } = req.query as unknown as TChaptersQuery

      if (href) {
        if (!reload) {
          const ranobe = await this.dbModel.getChapters(title)

          if (ranobe) {
            return res.json(ranobe)
          }
        }

        const data = await this.ranobeLibMeService.getChapters(href)
        title && (await this.dbModel.setChapters(title, data))
        return res.json(data)
      }

      res.sendStatus(500)
    }
  }

  download(): RequestHandler {
    return async (req, res) => {
      type TDownloadQuery = {
        title: string
        ranobeHrefList: string[]
        reload: boolean
      }

      const { title, ranobeHrefList, reload } = req.body as TDownloadQuery

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
          readerContainer = await this.ranobeLibMeService.getChapterText(
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
