import path from 'path'
import { v4 } from 'uuid'
import { IReaderContainer } from '../tools/service-responses/ranobelib-me.response'
import UtilsService from './utils.service'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodepub = require('nodepub')

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

export default class EpubGenService {
  private utils: UtilsService

  constructor(
    private metadata: IEpubMetaData,
    private readerContainer: IReaderContainer[]
  ) {
    this.utils = new UtilsService()
  }

  async generate(): Promise<unknown> {
    fillRandomData(this.metadata)

    const epub = nodepub.document(this.metadata)

    for (const sheet of this.readerContainer) {
      const { textContent, title } = sheet
      epub.addSection(title, textContent)
    }

    const directory = path.join(__dirname, '../ranobe')

    await this.utils.checkFolder(directory)

    return epub.writeEPUB(directory, `Ranobe ${this.metadata.title}`)
  }
}

function fillRandomData(obj: any) {
  const keys = [
    'id',
    'author',
    'series',
    'sequence',
    'fileAs',
    'genre',
    'tags',
    'copyright',
    'publisher',
    'published',
    'language',
    'description',
    'contents',
    'source'
  ]

  keys.forEach(key => {
    obj[key] = v4()
  })
}
