import { Logger } from 'tslog'
import { autoInjectable } from 'tsyringe'
import { ERanobeUrls } from '../tools/enums/Services.enum'
import { IRanobe } from '../tools/interfaces/Ranobelibme.interface'
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

    await page.goto(this.baseUrl, {
      waitUntil: 'domcontentloaded'
    })
    await page.$('body')

    const ranobeList = await page.evaluate((): IRanobe[] => {
      const slides = document.querySelectorAll('.swiper-slide')
      const filterdSlides = Array.from(slides).filter(slide => {
        return !slide.classList.contains('swiper-slide-duplicate')
      })

      const data = filterdSlides.map(el => {
        const ranobe: IRanobe = {
          title: el.textContent || '',
          href: '',
          cover: ''
        }

        let stop = false
        let currentEl = el

        while (!stop) {
          const tagName = currentEl.tagName.toLowerCase()

          if (tagName === 'a') {
            ranobe.href = currentEl.getAttribute('href') || ''
          } else if (tagName === 'img') {
            ranobe.cover = currentEl.getAttribute('src') || ''
          }

          if (!currentEl.children.length) stop = true

          currentEl = currentEl.children[0]
        }

        return ranobe
      })

      return data
    })

    await browser.close()

    return ranobeList
  }
}
