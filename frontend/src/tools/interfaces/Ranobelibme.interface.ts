export interface IRanobelibmeIdQuery {
  href: string
  title?: string
  reload?: boolean
  userId?: string
}

export interface IRanobelibmeIdDownload {
  title: string
  ranobeHrefList: string[]
  reload?: boolean
}

export interface ILoginForm {
  email: string
  password: string
}
