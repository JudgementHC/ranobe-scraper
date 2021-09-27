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
