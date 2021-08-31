import puppeteer, { Browser, Page } from 'puppeteer'
import PuppeteerExtra from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

export default class UtilsService {
  getPuppeeterStealth = async (): Promise<[Page, Browser]> => {
    const puppeteer = PuppeteerExtra.use(StealthPlugin())
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    return [page, browser]
  }

  getPuppeeter = async (): Promise<[Page, Browser]> => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    return [page, browser]
  }
}
