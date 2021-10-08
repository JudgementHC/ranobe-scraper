export interface IUser {
  email: string
  identifier: number
  ranobeList: IRanobe[]
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
  date: string
}
