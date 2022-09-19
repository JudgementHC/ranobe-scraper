import fs from 'fs'
import path from 'path'
import puppeteer, { Browser, Page, Protocol } from 'puppeteer'
import PuppeteerExtra from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { Logger } from 'tslog'
import { ERanobeServices } from '../../tools/enums/Services.enum'
import {
  SessionParams,
  Sessions
} from '../../tools/interfaces/Common.interface'
import { IRanobePatternParams } from '../../tools/interfaces/Ranobelibme.interface'
import SessionsJson from '../../tools/sessions.json'
import { default as Store } from './Store.service'

const sessions = SessionsJson as unknown as Sessions

export default class UtilsService {
  private logger = new Logger()

  getPuppeeterStealth = async (
    connectionId: string
  ): Promise<[Page, Browser]> => {
    const puppeteer = PuppeteerExtra.use(StealthPlugin())
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    Store.getInstance().state.set(connectionId, {
      browser
    })
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

  getCookies(service: ERanobeServices): Protocol.Network.Cookie[] {
    const serviceSession = sessions[
      service.toLocaleLowerCase()
    ] as unknown as SessionParams
    const cookies = serviceSession.cookies
    return cookies
  }

  // todo: куки неверно записывает в sessions
  async setCookies(
    service: ERanobeServices,
    cookies: Protocol.Network.Cookie[]
  ): Promise<void> {
    return new Promise((res, rej) => {
      const filePath = path.join(__dirname, '../../tools/sessions.json')
      const serviceSession = sessions[service] as unknown as SessionParams
      serviceSession.cookies = cookies

      fs.writeFile(filePath, JSON.stringify(sessions), err => {
        if (err) {
          rej(err)
        }
        res()
      })
    })
  }

  async removeProcess(connectionId: string): Promise<void> {
    const { state } = Store.getInstance()
    const connectionProcess = state.get(connectionId)
    await connectionProcess?.browser.close()
    state.delete(connectionId)
  }
}
