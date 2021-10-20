import path from 'path'
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
      [this.serviceName]: {
        ranobe: []
      }
    })
  }

  getLocalList = (): IRanobe[] => {
    let ranobeList: IRanobe[] = []
    try {
      ranobeList = this.stormDB
        .get(this.serviceName)
        .get('ranobe')
        .value() as IRanobe[]
    } catch (error) {
      console.error(error)
    }
    return ranobeList
  }

  setLocalList = async (data: IRanobe[]): Promise<void> => {
    const usersState = this.stormDB.get(this.serviceName)
    const list = usersState.get('ranobe')
    let listValue = []

    try {
      listValue = list.value()
    } catch (error) {
      this.logger.error(error)
    }

    const ranobeList: IRanobe[] = listValue?.length ? listValue : []

    data.forEach(ranobe => {
      const ranobeIndex = ranobeList.findIndex(
        item => item.href === ranobe.href
      )
      if (ranobeIndex >= 0) {
        ranobeList[ranobeIndex] = ranobe
      } else {
        ranobeList.push(ranobe)
      }
    })

    list.set(ranobeList)
    await list.save()
  }

  setLocalUser = async (user: IUser): Promise<void> => {
    try {
      this.stormDB.get(this.serviceName).set('user', user)
      await this.stormDB.save()
    } catch (error) {
      this.logger.error(error)
    }
  }

  setChapters = async (title: string, chapters: Chapter[]): Promise<void> => {
    const localList = this.getLocalList()
    const ranobe = localList?.find(el => el.title === title) as IRanobe

    if (ranobe) {
      const serviceDB = this.stormDB.get(this.serviceName)
      ranobe.chapters = chapters
      serviceDB.set('ranobe', localList)
      await this.stormDB.save()
    }
  }

  getChapters = async (title: string): Promise<Chapter[] | undefined> => {
    const localList = this.getLocalList()
    const targetRanobe = localList?.find(ranobe => title === ranobe.title)
    return targetRanobe?.chapters
  }
}
