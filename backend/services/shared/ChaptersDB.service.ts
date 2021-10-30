import fs from 'fs'
import { autoInjectable } from 'tsyringe'
import {
  IName,
  IReaderContainer
} from '../../tools/interfaces/Ranobelibme.interface'
import UtilsService from './Utils.service'

@autoInjectable()
export default class TempDBService {
  constructor(private utils: UtilsService) {}

  saveRanobeData = async (
    name: IName,
    data: IReaderContainer[]
  ): Promise<void> => {
    const { title, start, end } = name
    const dir = this.utils.tempFolderPath()
    const fileName = this.utils.tempRanobePattern(title, start, end)

    return new Promise((res, rej) => {
      this.utils
        .checkFolder(dir)
        .then(() => {
          fs.writeFile(fileName, JSON.stringify(data), err => {
            if (err) {
              return rej(err)
            }
            res()
          })
        })
        .catch(err => rej(err))
    })
  }
}
