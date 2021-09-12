import { RequestHandler } from 'express'
import { autoInjectable } from 'tsyringe'
import DBmodelService from '../services/DBmodel.service'
import RanobeLibMeService, {
  ILoginForm
} from '../services/ranobelib-me.service'
import { IRanobeController } from '../tools/interfaces/RanobeService.interface'
import { IUser } from '../tools/interfaces/User.interface'

@autoInjectable()
export default class RanobeLibMeController implements IRanobeController {
  dbModel: DBmodelService

  constructor(private ranobeLibMeService: RanobeLibMeService) {
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
      } catch (error) {
        console.error(error)
      }

      res.sendStatus(404)
    }
  }

  getUserRanobeList(): RequestHandler {
    return async (req, res) => {
      try {
        const cookies = this.dbModel.getCookies()

        const ranobeList = await this.ranobeLibMeService.getUserRanobeList(
          cookies
        )

        await this.dbModel.setLocalList(ranobeList)

        return res.json(ranobeList)
      } catch (error) {
        console.error(error)
      }

      res.sendStatus(404)
    }
  }

  getLocalRanobeList(): RequestHandler {
    return (req, res) => {
      res.json(this.dbModel.getLocalList())
    }
  }
}
