import { RequestHandler } from 'express'
import fs from 'fs'
import { Logger } from 'tslog'
import { autoInjectable } from 'tsyringe'
import DBmodelService from '../services/DBmodel.service'
import EpubGenService, { IEpubMetaData } from '../services/epub-gen.service'
import RanobeLibMeService, {
  ILoginForm
} from '../services/ranobelib-me.service'
import TempDBService from '../services/temp-db.service'
import UtilsService from '../services/utils.service'
import { IRanobeController } from '../tools/interfaces/RanobeService.interface'
import { IUser } from '../tools/interfaces/User.interface'
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
      const loginForm = req.body as ILoginForm

      if (loginForm.email && loginForm.password) {
        const [cookies, identifier, ranobeList] =
          await this.ranobeLibMeService.login(loginForm)

        cookies.forEach((cookie, index) => {
          res.setHeader(`ranobelib-auth_${index}`, JSON.stringify(cookie))

          const { expires, path, name, value, secure } = cookie
          res.cookie(name, value, {
            domain: process.env.BASE_URL,
            expires: new Date(Date.now() + expires),
            path: path,
            secure,
            httpOnly: false
          })
        })

        const user: IUser = {
          email: loginForm.email,
          identifier,
          cookies,
          ranobeList,
          domain: cookies[0].domain
        }

        await this.dbModel.setLocalUser(user)

        return res.json(user)
      }

      res.sendStatus(404)
    }
  }

  getUserRanobeList(): RequestHandler {
    return async (req, res) => {
      const user = this.dbModel.getLocalUser()

      if (user) {
        const cookies = this.dbModel.getCookies()

        const ranobeList = await this.ranobeLibMeService.getUserRanobeList(
          cookies,
          user.identifier
        )

        await this.dbModel.setLocalList(ranobeList)

        return res.json(ranobeList)
      }

      res.sendStatus(404)
    }
  }

  getLocalRanobeList(): RequestHandler {
    return (req, res) => {
      const localList = this.dbModel.getLocalList()

      if (localList) {
        return res.json(localList)
      }

      res.sendStatus(404)
    }
  }

  search(): RequestHandler {
    return async (req, res) => {
      const { title } = req.query

      if (title) {
        const data = await this.ranobeLibMeService.search(title as string)

        return res.json(data)
      }

      res.sendStatus(404)
    }
  }

  getAvailableChapters(): RequestHandler {
    return async (req, res) => {
      type TChaptersQuery = { title: string; href: string; reload: boolean }
      const { title, href, reload } = req.query as unknown as TChaptersQuery
      if (href) {
        if (!reload) {
          const ranobe = await this.dbModel.getChapters(title)

          if (ranobe) {
            return res.json(ranobe)
          }
        }

        const data = await this.ranobeLibMeService.getAvailableChapters(href)
        title && (await this.dbModel.setChapters(title, data))
        return res.json(data)
      }

      res.sendStatus(404)
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

      const fileName = this.utils.getTempRanobePattern(title, start, end)
      let file

      if (!reload && fs.existsSync(fileName)) {
        file = JSON.parse(fs.readFileSync(fileName).toString())
      }

      try {
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

        const epubGenService = new EpubGenService(metadata, readerContainer)
        await epubGenService.generate()

        return res.sendStatus(200)
      } catch (error) {
        this.logger.error(error as Error)
      }

      res.sendStatus(404)
    }
  }
}
