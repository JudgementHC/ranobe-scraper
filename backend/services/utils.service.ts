import fs from 'fs'
import path from 'path'
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

  checkFolder = async (folderName: string): Promise<void> => {
    if (!fs.existsSync(folderName)) {
      return new Promise((res, rej) => {
        fs.mkdir(folderName, err => {
          if (err?.code !== 'EEXIST') {
            return rej(err)
          }
          res()
        })
      })
    }
  }

  getTempFolderPath(): string {
    return path.join(__dirname, '../ranobe-temp')
  }

  getTempRanobePattern(title?: string, start?: string, end?: string): string {
    const dir = this.getTempFolderPath()
    return `${dir}/${title} (start ${start}, end ${end}).json`
  }
}
