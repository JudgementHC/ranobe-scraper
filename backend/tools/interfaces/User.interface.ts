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
  chapters?: IChapter[]
}

export interface IChapter {
  title: string
  href: string
  author: string
  date: string
}
