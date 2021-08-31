import { RequestHandler } from 'express'
import { Protocol } from 'puppeteer'
import { autoInjectable } from 'tsyringe'
import RanobeLibMeService, {
  ILoginForm
} from '../services/ranobelib-me.service'
import { IRanobeController } from '../tools/interfaces/RanobeService.interface'

@autoInjectable()
export default class RanobeLibMeController implements IRanobeController {
  constructor(private ranobeLibMeService: RanobeLibMeService) {}

  login(): RequestHandler {
    return async (req, res) => {
      try {
        const loginForm = req.body as ILoginForm

        if (loginForm.email && loginForm.password) {
          const cookies = await this.ranobeLibMeService.login(loginForm)

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

          res.json({ domain: cookies[0].domain })
          return
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
        const cookies: Protocol.Network.Cookie[] = []

        for (const prop in req.headers) {
          if (prop.startsWith('ranobelib-auth')) {
            const cookie: Protocol.Network.Cookie = JSON.parse(
              req.headers[prop] as string
            )
            cookies.push(cookie)
          }
        }

        const userListContent = await this.ranobeLibMeService.getUserRanobeList(
          cookies
        )

        return res.json(userListContent)
      } catch (error) {
        console.error(error)
      }

      res.sendStatus(404)
    }
  }
}
