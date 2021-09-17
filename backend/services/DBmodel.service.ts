import path from 'path'
import { Protocol } from 'puppeteer'
import StormDB from 'stormdb'
import { Chapter, IRanobe, IUser } from '../tools/interfaces/User.interface'
import { TRanobeServices } from '../tools/types/Services.type'
import fs from 'fs'

export default class DBmodelService {
  private stormDB: StormDB

  constructor(private serviceName: TRanobeServices) {
    const pathName = path.join(__dirname, '../database')
    const fileName = 'ranobe.stormdb'
    const fullPath = `${pathName}/${fileName}`

    try {
      fs.mkdirSync(pathName)
    } catch (error) {
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, '')
      }
    }

    const engine = new StormDB.localFileEngine(fullPath)
    this.stormDB = new StormDB(engine)
    this.stormDB.default({
      user: {
        ranobeList: []
      }
    })
  }

  getLocalList = (): IRanobe[] => {
    return this.stormDB
      .get(this.serviceName)
      .get('user')
      .get('ranobeList')
      .value() as unknown as IRanobe[]
  }

  setLocalList = async (data: IRanobe[]): Promise<void> => {
    try {
      const userState = this.stormDB.get(this.serviceName).get('user')
      const list = userState.get('ranobeList')
      list.set(data)
      await list.save()
    } catch (error) {
      console.error(error)
    }
  }

  setLocalUser = async (user: IUser): Promise<void> => {
    try {
      this.stormDB.get(this.serviceName).set('user', user)
      await this.stormDB.save()
    } catch (error) {
      console.error(error)
    }
  }

  getLocalUser = (): IUser => {
    return this.stormDB
      .get(this.serviceName)
      .get('user')
      .value() as unknown as IUser
  }

  getCookies = (): Protocol.Network.Cookie[] => {
    const userState = this.stormDB.get(this.serviceName).get('user')
    return userState
      .get('cookies')
      .value() as unknown as Protocol.Network.Cookie[]
  }

  setChapters = async (title: string, chapters: Chapter[]): Promise<void> => {
    const localList = this.getLocalList()
    const ranobe = localList.find(el => el.title === title) as IRanobe

    const serviceDB = this.stormDB.get(this.serviceName)

    if (ranobe) {
      ranobe.chapters = chapters
      serviceDB.get('user').set('ranobeList', localList)
      await this.stormDB.save()
    }
  }
}
