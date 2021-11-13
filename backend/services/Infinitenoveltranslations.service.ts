import { Logger } from 'tslog'
import { autoInjectable } from 'tsyringe'
import { ERanobeUrls } from '../tools/enums/Services.enum'
import {
  IDefaultChapter,
  IDefaultComposition,
  IRanobe
} from '../tools/interfaces/Common.interface'
import { IRanobeService } from '../tools/interfaces/Services.interface'
import UtilsService from './shared/Utils.service'

@autoInjectable()
export default class InfinitenoveltranslationsService
  implements IRanobeService
{
  baseUrl = ERanobeUrls.INFINITENOVELTRANSLATIONS
  private logger = new Logger()

  constructor(private utils: UtilsService) {}

  async ranobeList(): Promise<IRanobe[]> {
    const [page, browser] = await this.utils.getPuppeeterStealth()
    const urlList = ['light-novels', 'web-novels', 'completed']
    const data: IRanobe[] = []

    for (let i = 0; i < urlList.length; i++) {
      const url = urlList[i]

      await page.goto(`${this.baseUrl}/${url}`, {
        waitUntil: 'domcontentloaded'
      })
      await page.$('body')

      const ranobe = await page.evaluate((): IRanobe[] => {
        const ranobeList: IRanobe[] = []

        const cardList = document.querySelectorAll(
          '.elementor-element.elementor-widget.elementor-widget-text-editor'
        )

        cardList.forEach(some => {
          const cover = some.querySelector('img')?.getAttribute('src')
          const titleSelector = Array.from(some.querySelectorAll('h3')).find(
            el => el.offsetHeight > 0
          )
          const title = titleSelector?.textContent
          const href = titleSelector
            ?.querySelector('a')
            ?.getAttribute('href')
            ?.replace('https://infinitenoveltranslations.net', '')
            ?.replace('/', '')

          ranobeList.push({
            cover,
            title,
            href
          })
        })

        return ranobeList
      })

      data.push(...ranobe)
    }

    await browser.close()

    return data
  }

  async chapters(href: string): Promise<IDefaultComposition> {
    const url = `${this.baseUrl}/${href}`
    const [page, browser] = await this.utils.getPuppeeterStealth()

    await page.goto(url, {
      waitUntil: 'domcontentloaded'
    })
    await page.$('body')

    const data = await page.evaluate((): IDefaultComposition => {
      const chapters: IDefaultChapter[] = []

      const entryContent = document.querySelector('.entry-content')
      const httpLinks = entryContent?.querySelectorAll<HTMLLinkElement>(
        'a[href^="http://infinitenoveltranslations.net/nidoume-no-jinsei-wo-isekai-de/"]'
      )
      httpLinks?.forEach(
        el => (el.href = el.href.replace(/^http:\/\//i, 'https://'))
      )

      const links = entryContent?.querySelectorAll<HTMLLinkElement>(
        'a[href^="https://infinitenoveltranslations.net/nidoume-no-jinsei-wo-isekai-de/"]'
      )
      links?.forEach(el => {
        chapters.push({
          href: el.href,
          title: el.textContent || ''
        })
      })

      const cover =
        document.querySelector('.size-full')?.getAttribute('src') || ''

      return {
        chapters,
        cover
      }
    })

    await browser.close()

    return data
  }
}
