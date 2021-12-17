import Protocol from 'devtools-protocol'
import { Browser } from 'puppeteer'
import { ERanobeServices } from '../enums/Services.enum'

export interface Sessions {
  [key: string]: ERanobeServices
}

export interface SessionParams {
  cookies: Protocol.Network.Cookie[]
}

export interface IRanobe {
  title?: string | null
  href?: string | null
  cover?: string | null
  chapters?: IDefaultChapter[]
}

export interface IUser {
  email: string
  identifier: number
  ranobeList: IRanobe[]
  domain?: string
}

export interface IDefaultChaptersQuery {
  title: string
  href: string
  reload: boolean
}

export interface IDefaultChapter {
  title: string
  href: string
}

export interface IDefaultComposition {
  chapters: IDefaultChapter[]
  cover: string
}

export interface IDefaultDownloadBody {
  title: string
  ranobeHrefList: string[]
  reload: boolean
}

export interface IStartEnd {
  start: string
  end: string
}

export interface IDefaultReaderContainer {
  title: string
  volume: string
  chapter: string
  textContent: string
}

export interface IEpubMetaData {
  title: string
  id?: string
  author?: string
  cover?: string
  series?: string
  sequence?: number
  fileAs?: string
  genre?: string
  tags?: string
  copyright?: string
  publisher?: string
  published?: string
  language?: string
  description?: string
  contents?: string
  source?: string
  images: string[]
}

export interface IConnectionProcess {
  browser: Browser
}
