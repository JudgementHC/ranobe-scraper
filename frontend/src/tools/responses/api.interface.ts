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
  checked?: false
  chapters?: Chapter[]
}

export interface Chapter {
  title: string
  href: string
  author: string
  date: string
}
