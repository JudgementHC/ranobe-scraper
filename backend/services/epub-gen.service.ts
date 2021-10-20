import path from 'path'
import { v4 } from 'uuid'
import { IReaderContainer } from '../tools/service-responses/ranobelib-me.response'
import UtilsService from './utils.service'
import fs from 'fs'

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
    private readerContainer: IReaderContainer[],
    private start: string,
    private end: string
  ) {
    this.utils = new UtilsService()
  }

  async generate(): Promise<string[]> {
    const title = this.utils.namePattern({
      title: this.metadata.title,
      start: this.start,
      end: this.end
    })

    if (fs.existsSync(title)) {
      return Promise.reject('File already exist')
    }

    fillRandomData(this.metadata)

    const epub = nodepub.document(this.metadata)

    for (const sheet of this.readerContainer.reverse()) {
      const { textContent, title } = sheet
      epub.addSection(title, textContent)
    }

    const directory = this.utils.ranobeFolderPath()

    await this.utils.checkFolder(directory)

    await epub.writeEPUB(directory, title)

    return [`${directory}/${title}.epub`, title]
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
