import cron from 'node-cron'
import findRemoveSync from 'find-remove'
import path from 'path'
import { Logger } from 'tslog'

export default class TempCleanerService {
  logger = new Logger()

  constructor(private fileAge = 3600) {}

  clean(): void {
    const ranobeTemp = path.join(__dirname, '../ranobe-temp/')
    const ranobe = path.join(__dirname, '../ranobe/')
    const config = {
      age: { seconds: this.fileAge },
      extensions: '*.*',
      dir: '*'
    }

    findRemoveSync(ranobeTemp, config)
    findRemoveSync(ranobe, config)
  }

  schedule(): void {
    const cronExp = '* * * * Sunday'
    cron.schedule(cronExp, this.clean)
    this.logger.info(`Cron scheduled every ${cronExp}`)
  }
}
