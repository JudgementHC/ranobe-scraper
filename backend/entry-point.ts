import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { Logger } from 'tslog'
import RanobelibmeRouter from './routes/Ranobelibme.route'

/*==================== INIT START ====================*/
const app = express()
dotenv.config()
const { PORT } = process.env
const logger = new Logger()
/*==================== INIT END ====================*/

/* ==================== MIDDLEWARE USING START ==================== */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000'
  })
)
app.use(helmet())
app.use(morgan('combined'))
/* ==================== MIDDLEWARE USING END ==================== */

// todo: добавить сервис для парсинга https://infinitenoveltranslations.net/nidoume-no-jinsei-wo-isekai-de/
/* ==================== ROUTES USE START ==================== */
app.use('/ranobelibme', RanobelibmeRouter.router)
/* ==================== ROUTES USE END ==================== */

/*==================== SERVER START ====================*/
app.set('port', PORT)
const server = app.listen(PORT, () => {
  logger.info(`Server started on ${PORT} port`)
})

process.on('exit', () => {
  logger.info('Server shuts down')
  server.close()
})
/*==================== SERVER END ====================*/
