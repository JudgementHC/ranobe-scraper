import { RequestHandler } from 'express'
import { autoInjectable } from 'tsyringe'
import DBmodelService from '../services/DBmodel.service'
import RanobeLibMeService, {
  ILoginForm
} from '../services/ranobelib-me.service'
import { IRanobeController } from '../tools/interfaces/RanobeService.interface'
import { Chapter, IUser } from '../tools/interfaces/User.interface'

@autoInjectable()
export default class RanobeLibMeController implements IRanobeController {
  dbModel: DBmodelService

  constructor(private ranobeLibMeService: RanobeLibMeService) {
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
      type TChaptersQuery = { title: string; href: string }
      const { title, href } = req.query as TChaptersQuery
      let data: Chapter[] = []

      if (href) {
        data = await this.ranobeLibMeService.getAvailableChapters(href)
        title && (await this.dbModel.setChapters(title, data))
        return res.json(data)
      }

      res.sendStatus(404)
    }
  }

  getLocalChapters(): RequestHandler {
    return async (req, res) => {
      const title = req.query.title as string

      const ranobe = await this.dbModel.getChapters(title)
      if (ranobe) {
        return res.json(ranobe)
      }

      res.sendStatus(404)
    }
  }

  download(): RequestHandler {
    return async (req, res) => {
      type TDownloadQuery = { title: string; ranobeHrefList: string[] }
      const { ranobeHrefList } = req.body as TDownloadQuery

      const data = await this.ranobeLibMeService.download(ranobeHrefList)

      if (data.length) {
        return res.json(data)
      }

      res.sendStatus(404)
    }
  }
}
