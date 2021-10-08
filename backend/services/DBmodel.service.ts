import fs from 'fs'
import path from 'path'
import { Protocol } from 'puppeteer'
import StormDB from 'stormdb'
import { Logger } from 'tslog'
import { Chapter, IRanobe, IUser } from '../tools/interfaces/User.interface'
import { TRanobeServices } from '../tools/types/Services.type'
import UtilsService from './utils.service'

export default class DBmodelService {
  private stormDB!: StormDB
  private logger = new Logger()
  private utils = new UtilsService()

  constructor(private serviceName: TRanobeServices) {
    this.init()
  }

  async init(): Promise<void> {
    const pathName = path.join(__dirname, '../database')
    const fileName = 'ranobe.stormdb'
    const fullPath = `${pathName}/${fileName}`

    await this.utils.checkFolder(pathName)
    await this.utils.checkFile(fullPath, '')

    const engine = new StormDB.localFileEngine(fullPath)
    this.stormDB = new StormDB(engine)
    this.stormDB.default({
      user: {
        ranobeList: []
      }
    })
  }

  getLocalList = (): IRanobe[] | undefined => {
    try {
      return this.stormDB
        .get(this.serviceName)
        .get('user')
        .get('ranobeList')
        .value() as IRanobe[]
    } catch (error) {
      return
    }
  }

  setLocalList = async (data: IRanobe[]): Promise<void> => {
    try {
      const userState = this.stormDB.get(this.serviceName).get('user')
      const list = userState.get('ranobeList')
      list.set(data)
      await list.save()
    } catch (error) {
      this.logger.error(error)
    }
  }

  setLocalUser = async (user: IUser): Promise<void> => {
    try {
      this.stormDB.get(this.serviceName).set('user', user)
      await this.stormDB.save()
    } catch (error) {
      this.logger.error(error)
    }
  }

  getLocalUser = (): IUser | undefined => {
    try {
      return this.stormDB.get(this.serviceName).get('user').value() as IUser
    } catch (error) {
      return
    }
  }

  getCookies = (): Protocol.Network.Cookie[] => {
    const userState = this.stormDB.get(this.serviceName).get('user')
    return userState
      .get('cookies')
      .value() as unknown as Protocol.Network.Cookie[]
  }

  setChapters = async (title: string, chapters: Chapter[]): Promise<void> => {
    const localList = this.getLocalList()
    const ranobe = localList?.find(el => el.title === title) as IRanobe

    if (ranobe) {
      const serviceDB = this.stormDB.get(this.serviceName)
      ranobe.chapters = chapters
      serviceDB.get('user').set('ranobeList', localList)
      await this.stormDB.save()
    }
  }

  getChapters = async (title: string): Promise<Chapter[] | undefined> => {
    const localList = this.getLocalList()
    const targetRanobe = localList?.find(ranobe => title === ranobe.title)
    return targetRanobe?.chapters
  }
}
