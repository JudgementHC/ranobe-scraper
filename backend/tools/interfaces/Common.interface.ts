import Protocol from 'devtools-protocol'
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
