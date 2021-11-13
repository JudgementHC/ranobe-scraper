import { TSearchType } from '../types/Ranobelibme.type'
import {
  IDefaultReaderContainer,
  IDefaultChapter,
  IDefaultChaptersQuery,
  IDefaultComposition,
  IDefaultDownloadBody
} from './Common.interface'

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

export interface IReaderContainer extends IDefaultReaderContainer {}

// todo: заменить интерфейсы, которые насследуются от дефолтных
export interface IChapter extends IDefaultChapter {
  author: string
  date: string
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
export interface IChaptersQuery extends IDefaultChaptersQuery {
  translate: string
}

export interface IDownloadQuery extends IDefaultDownloadBody {}

export interface IGetChapters extends IDefaultComposition {}
