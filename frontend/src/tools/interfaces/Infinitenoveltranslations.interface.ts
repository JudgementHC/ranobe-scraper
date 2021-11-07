export interface IQuery {
  href: string
  title?: string
  reload?: boolean
}

export interface IDownload {
  title?: string
  ranobeHrefList: string[]
  reload?: boolean
}

export interface ILoginForm {
  email: string
  password: string
}

export interface ISearchResponse {
  id: number
}

export interface ICovers {
  default: string
  thumbnail: string
}
