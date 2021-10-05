import fs from 'fs'
import path from 'path'
import puppeteer, { Browser, Page } from 'puppeteer'
import PuppeteerExtra from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

interface IRanobePatternParams {
  dir?: string
  title?: string
  start?: string
  end?: string
  ext?: string
}

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

  tempFolderPath(): string {
    return path.join(__dirname, '../ranobe-temp')
  }

  ranobeFolderPath(): string {
    return path.join(__dirname, '../ranobe')
  }

  tempRanobePattern(title?: string, start?: string, end?: string): string {
    const dir = this.tempFolderPath()
    const ext = 'json'
    return this.namePattern({ title, start, end, dir, ext })
  }

  namePattern(params: IRanobePatternParams): string {
    const { dir, title, start, end, ext } = params
    return `${dir ? dir + '/' : ''}${title} (start ${start}, end ${end})${
      ext ? '.' + ext : ''
    }`
  }
}
