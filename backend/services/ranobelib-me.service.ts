import { Browser, Page, Protocol } from 'puppeteer'
import { autoInjectable } from 'tsyringe'
import { DefaultService } from '../tools/interfaces/RanobeService.interface'
import { IRanobe } from '../tools/interfaces/User.interface'
import UtilsService from './utils.service'

export interface ILoginForm {
  email: string
  password: string
}

@autoInjectable()
export default class RanobeLibMeService implements DefaultService {
  baseUrl = 'https://ranobelib.me'

  constructor(private utils: UtilsService) {}

  async login(
    loginForm: ILoginForm
  ): Promise<[Protocol.Network.Cookie[], number, IRanobe[]]> {
    const [page, browser] = await this.utils.getPuppeeterStealth()

    await page.goto(this.baseUrl, {
      waitUntil: 'networkidle2'
    })

    await page.$('body')

    await page.click('#show-login-button')
    await page.waitForSelector('#sign-in-modal')
    await page.type('input[name=email]', loginForm.email)
    await page.type('input[name=password]', loginForm.password)
    await page.click('#sign-in-form .form__footer button[type=submit]')
    await page.waitForNavigation()

    await page.$('body')

    const userAvatar = await page.$<HTMLElement>('.header-right-menu__avatar')
    const identifier =
      (await userAvatar?.evaluate(img => {
        const src = img.getAttribute('src')?.split('/') || []
        return +(src[src.length - 2] || 0)
      })) || 0

    const cookies = (await page.cookies()).filter(
      cookie => cookie.name.charAt(0) !== '_'
    )

    const ranobeList = await this.getUserRanobeList(cookies)

    await browser.close()

    return [cookies, identifier, ranobeList]
  }

  async getUserRanobeList(
    cookies: Protocol.Network.Cookie[],
    page?: Page,
    browser?: Browser
  ): Promise<IRanobe[]> {
    if (!page || !browser) {
      ;[page, browser] = await this.utils.getPuppeeterStealth()

      await page.setCookie(...cookies)
      await page.goto(this.baseUrl, {
        waitUntil: 'networkidle2'
      })
      await page.$('body')
    }

    const profileLink = await page.$<HTMLLinkElement>(
      '.header__item.header-right-menu a.header-right-menu__item.header-button'
    )

    await profileLink?.evaluate(b => b.click())
    await page.waitForNavigation({
      waitUntil: 'networkidle2'
    })

    const data = await page.evaluate(() => {
      const bookmarkItem = '.bookmark__list.paper .bookmark-item'
      const $covers = document.querySelectorAll(
        `${bookmarkItem} .bookmark-item__cover`
      )
      const $titleLinks = document.querySelectorAll(
        `${bookmarkItem} .bookmark-item__name`
      )

      const coverList = Array.from($covers).map(cover =>
        cover.getAttribute('style')
      )

      return Array.from($titleLinks).map((title, index) => {
        return {
          title: title.firstChild?.textContent,
          href: title.getAttribute('href'),
          cover: coverList[index]
        } as IRanobe
      })
    })

    browser.close()

    return data
  }
}
