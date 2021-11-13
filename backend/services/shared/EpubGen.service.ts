import fs from 'fs'
import { IEpubMetaData } from '../../tools/interfaces/Common.interface'
import { IReaderContainer } from '../../tools/interfaces/Ranobelibme.interface'
import UtilsService from './Utils.service'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodepub = require('nodepub')

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
    obj[key] = key
  })
}
