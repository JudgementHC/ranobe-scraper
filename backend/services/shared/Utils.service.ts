import fs from 'fs'
import path from 'path'
import puppeteer, { Browser, Page, Protocol } from 'puppeteer'
import PuppeteerExtra from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { IRanobePatternParams } from '../../tools/interfaces/Ranobelibme.interface'
import Sessions from '../../tools/sessions.json'
import { TRanobeServices } from '../../tools/types/Services.type'

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
    return new Promise(res => {
      if (!fs.existsSync(folderName)) {
        return fs.mkdir(folderName, () => res())
      }
      res()
    })
  }

  checkFile = async (fullPath: string, content: string): Promise<void> => {
    return new Promise(res => {
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, content)
      }
      res()
    })
  }

  tempFolderPath(): string {
    return path.join(__dirname, '../../ranobe-temp')
  }

  ranobeFolderPath(): string {
    return path.join(__dirname, '../../ranobe')
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

  getCookies(service: TRanobeServices): Protocol.Network.Cookie[] {
    const cookies = Sessions[service]?.cookies as Protocol.Network.Cookie[]
    return cookies
  }

  async setCookies(
    service: TRanobeServices,
    cookies: Protocol.Network.Cookie[]
  ): Promise<void> {
    return new Promise((res, rej) => {
      const filePath = path.join(__dirname, '../../tools/sessions.json')
      const sessions = Object.assign({}, Sessions)
      sessions[service].cookies = cookies

      fs.writeFile(filePath, JSON.stringify(sessions), err => {
        if (err) {
          rej(err)
        }
        res()
      })
    })
  }
}
