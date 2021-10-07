import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { Logger } from 'tslog'
import RanobeLibMeRouter from './routes/ranobelib-me.route'
import TempCleanerService from './services/temp-cleaner.service'

/*==================== INIT START ====================*/
const app = express()
dotenv.config()
const { PORT } = process.env
const logger = new Logger()
const cleanEvery = 5 // days
/*==================== INIT END ====================*/

/* ==================== MIDDLEWARE USING START ==================== */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
app.use(morgan('combined'))
/* ==================== MIDDLEWARE USING END ==================== */

/* ==================== ROUTES USE START ==================== */
app.use('/ranobelibme', RanobeLibMeRouter.router)
/* ==================== ROUTES USE END ==================== */

/*==================== SERVER START ====================*/
app.set('port', PORT)
const server = app.listen(PORT, () => {
  logger.info(`Server started on ${PORT} port`)
  const { NODE_ENV } = process.env
  if (NODE_ENV === 'production') {
    const tempCleanerService = new TempCleanerService(3600 * 24 * cleanEvery)
    tempCleanerService.schedule()
  }
})

process.on('exit', () => {
  logger.info('Server shuts down')
  server.close()
})
/*==================== SERVER END ====================*/
