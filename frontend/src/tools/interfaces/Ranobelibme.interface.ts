export interface IRanobelibmeIdQuery {
  href: string
  title?: string
  reload?: boolean
  userId?: string
  translate?: string
}

export interface IRanobelibmeIdDownload {
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
