import { TSearchType } from '../types/Ranobelibme.type'

export interface ISearchResponse {
  id: number
  slug?: string
  cover?: string
  name?: string
  rus_name?: string
  eng_name?: string
  rate_avg?: string
  type_id?: number
  covers?: ICovers
  value?: string
  avatar?: string
}

export interface ICovers {
  default: string
  thumbnail: string
}

export interface IReaderContainer {
  title: string
  volume: string
  chapter: string
  textContent: string
}

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

export interface ILoginForm {
  email: string
  password: string
}

export interface IName {
  title: string
  start: string
  end: string
}

export interface IRanobePatternParams {
  dir?: string
  title?: string
  start?: string
  end?: string
  ext?: string
}

export interface IUserListQuery {
  userId: number
  local: boolean
}
export interface ISearchQuery {
  title: string
  type: TSearchType
}
export interface IChaptersQuery {
  title: string
  href: string
  reload: boolean
  translate: string
}
export interface IDownloadQuery {
  title: string
  ranobeHrefList: string[]
  reload: boolean
}

export interface IGetChapters {
  chapters: IChapter[]
  cover: string
}
