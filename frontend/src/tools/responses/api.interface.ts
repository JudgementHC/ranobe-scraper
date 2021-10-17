import Protocol from 'devtools-protocol'

export interface IUser {
  email: string
  identifier: number
  ranobeList: IRanobe[]
  cookies: Protocol.Network.Cookie[]
  domain?: string
}

export interface IRanobe {
  title: string
  href: string
  cover: string
  chapters?: Chapter[]
}

export interface Chapter {
  title: string
  href: string
  author: string
  checked: boolean
  date: string
}

export interface ISearchResponse {
  id: number
  slug: string
  cover: string
  name: string
  rus_name: string
  eng_name: string
  rate_avg: string
  type_id: number
  covers: ICovers
  value: string
  avatar: string
}

export interface ICovers {
  default: string
  thumbnail: string
}
