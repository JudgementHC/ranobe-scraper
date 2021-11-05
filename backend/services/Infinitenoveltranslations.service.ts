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
      const lightNovels = document.querySelector('#prime_nav > li:first-child')
    })

    await browser.close()

    return ranobeList
  }
}
