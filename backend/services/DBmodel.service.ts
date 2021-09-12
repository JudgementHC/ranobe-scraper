import path from 'path'
import { Protocol } from 'puppeteer'
import StormDB from 'stormdb'
import { IRanobe, IUser } from '../tools/interfaces/User.interface'
import { TRanobeServices } from '../tools/types/Services.type'

export default class DBmodelService {
  private stormDB: StormDB

  constructor(private serviceName: TRanobeServices) {
    const engine = new StormDB.localFileEngine(
      path.join(__dirname, '../database/ranobe.stormdb')
    )
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
      .get('ranobeList') as unknown as IRanobe[]
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
    return this.stormDB.get(this.serviceName).get('user') as unknown as IUser
  }

  getCookies = (): Protocol.Network.Cookie[] => {
    const userState = this.stormDB.get(this.serviceName).get('user')
    return userState.get('cookies') as unknown as Protocol.Network.Cookie[]
  }
}
