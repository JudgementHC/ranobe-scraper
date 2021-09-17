import { Browser, Page, Protocol } from 'puppeteer'
import { autoInjectable } from 'tsyringe'
import { ERanobeUrls } from '../tools/enums/Services.enum'
import { DefaultService } from '../tools/interfaces/RanobeService.interface'
import { Chapter, IRanobe } from '../tools/interfaces/User.interface'
import { ISearchResponse } from '../tools/service-responses/ranobelib-me.response'
import UtilsService from './utils.service'

export interface ILoginForm {
  email: string
  password: string
}

@autoInjectable()
export default class RanobeLibMeService implements DefaultService {
  baseUrl = ERanobeUrls.RANOBELIBME

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

    const ranobeList = await this.getUserRanobeList(cookies, identifier)

    await browser.close()

    return [cookies, identifier, ranobeList]
  }

  async getUserRanobeList(
    cookies: Protocol.Network.Cookie[],
    userId: number,
    page?: Page,
    browser?: Browser
  ): Promise<IRanobe[]> {
    const ranobeListUrl = `${this.baseUrl}/user/${userId}?folder=all`

    if (!page || !browser) {
      ;[page, browser] = await this.utils.getPuppeeterStealth()
      await page.setCookie(...cookies)
    }

    await page.goto(ranobeListUrl, {
      waitUntil: 'networkidle2'
    })
    await page.$('body')

    const data = await page.evaluate(() => {
      const bookmarkItem = '.bookmark__list.paper .bookmark-item'
      const $covers = document.querySelectorAll(
        `${bookmarkItem} .bookmark-item__cover`
      )
      const $titleLinks = document.querySelectorAll(
        `${bookmarkItem} .bookmark-item__name`
      )

      const coverList = Array.from($covers).map(cover => {
        const attribute = cover.getAttribute('style')

        if (attribute) {
          const regex = /\((.*?)\)/gm
          const replaced = attribute.replace(/"/gm, '').match(regex)
          if (replaced) return replaced[0].replace('(', '').replace(')', '')
        }

        return attribute
      })

      return Array.from($titleLinks).map((title, index) => {
        return {
          title: title.firstChild?.textContent,
          href: title.getAttribute('href')?.split('?')[0].replace('/', ''),
          cover: coverList[index]
        } as IRanobe
      })
    })

    await browser.close()

    return data
  }

  async search(title: string): Promise<ISearchResponse> {
    const searchUrl = `${this.baseUrl}/search?type=manga&q=${title}`

    const [page, browser] = await this.utils.getPuppeeterStealth()

    await page.goto(searchUrl, {
      waitUntil: 'networkidle2'
    })

    await page.content()

    const data = await page.evaluate(() => {
      return JSON.parse(
        document.querySelector('body')?.innerText || 'no content'
      )
    })

    await browser.close()

    return data
  }

  async getAvailableChapters(href: string): Promise<Chapter[]> {
    const url = `${this.baseUrl}/${href}?section=chapters`

    const [page, browser] = await this.utils.getPuppeeterStealth()

    await page.setViewport({
      width: 1920,
      height: 1080
    })
    await page.goto(url, {
      waitUntil: 'networkidle2'
    })

    const data = (await page.evaluate(async () => {
      try {
        let currentScroll = 0
        let { scrollHeight } = document.body

        while (currentScroll !== scrollHeight) {
          window.scrollBy(0, scrollHeight)
          currentScroll = scrollHeight
          await new Promise(resolve => setTimeout(resolve, 1500))
          scrollHeight = document.body.scrollHeight
        }
      } catch (error) {
        console.error(error)
      }

      const itemView = document.querySelectorAll(
        '.vue-recycle-scroller__item-view'
      )

      const innerData = Array.from(itemView).map(el => {
        const mediaChapter = el.children[0]
        const mediaChapterBody = mediaChapter.children[1]
        const { children } = mediaChapterBody

        if (children.length) {
          const temp = {
            title: '',
            href: '',
            author: '',
            date: ''
          }

          Array.from(children).forEach((el, index) => {
            switch (index) {
              case 0: {
                const linkTag = el.children[0]
                temp.title = linkTag.textContent?.trim() || 'empty'
                temp.href = linkTag.getAttribute('href') || 'empty'
                break
              }

              case 1: {
                temp.author = el.textContent?.trim() || 'empty'
                break
              }

              case 2: {
                temp.date = el.textContent?.trim() || 'empty'
                break
              }

              default: {
                break
              }
            }
          })

          return temp
        }

        return 'Empty object'
      })

      return innerData
    })) as Chapter[]

    await browser.close()

    return data
  }
}
