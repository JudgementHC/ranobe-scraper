export interface ISearchResponse {
  id: number
  slug: string
  cover: string
  name: string
  rus_name: string
  eng_name: string
  rate_avg: string
  type_id: number
  covers: Covers
}

export interface Covers {
  default: string
  thumbnail: string
}
