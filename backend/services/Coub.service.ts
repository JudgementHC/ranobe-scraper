import path from 'path'
import puppeteer from 'puppeteer'
import { Logger } from 'tslog'
import { autoInjectable } from 'tsyringe'
import CoubLinks from '../coub_data/links.json'
import UtilsService from './shared/Utils.service'

@autoInjectable()
export default class CoubService {
  baseUrl = 'https://9xbuddy.com/process?url=https://coub.com/view'
  downloadPath = path.resolve(__dirname, '../coub_data/downloads')

  logger = new Logger()

  constructor(private utils: UtilsService) {}

  async downloadCoub(): Promise<void> {
    const [page] = await this.utils.getPuppeeter()

    for (let i = 0; i < CoubLinks.length; i++) {
      const coubId = CoubLinks[i]
      const url = `${this.baseUrl}/${coubId}`
      try {
        await page.goto(url, {
          waitUntil: 'networkidle2'
        })
        await page.content()
        await page.waitForSelector(
          'a[href^="https://coub-anubis-a.akamaized.net"]'
        )
        await page.click('a[href^="https://coub-anubis-a.akamaized.net"]')
      } catch (err) {
        throw new Error(`Error in Coub service: ${err}`)
      }
    }

    // await browser.close()
  }
}
