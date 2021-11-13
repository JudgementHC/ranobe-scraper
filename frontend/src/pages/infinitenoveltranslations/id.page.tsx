import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup
} from '@mui/material'
import axios from 'axios'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import ChapterListComponent from '../../components/chapterlist/ChapterList.component'
import infinitenoveltranslationsApi from '../../tools/axios/infinitenoveltranslations.api'
import { IChapter, IComposition } from '../../tools/interfaces/API.interface'
import {
  IDownload,
  IQuery
} from '../../tools/interfaces/Infinitenoveltranslations.interface'
import { StoreContext } from '../../tools/store'

interface Params {
  id: string
}

export default function InfinitenoveltranslationsId(): JSX.Element {
  const [checkAll, setCheckAll] = useState(false)
  const [chapterList, setChapterList] = useState<IChapter[]>([])
  const params = useParams<Params>()
  const location = useLocation()
  const store = useContext(StoreContext)
  const [, setSnackbar] = store.snackbar
  const [loading, setLoading] = store.loading
  const request = axios.CancelToken.source()
  const [title, setTitle] = useState<string | undefined>()

  const onCheck = (event: ChangeEvent, checked: boolean) => {
    const index = event.target.getAttribute('name')
    const changedChapterList = chapterList.map((ranobe, i) => {
      if (index && i === +index) {
        ranobe.checked = checked
      }
      return ranobe
    })
    setChapterList(changedChapterList)
  }

  const checkAllChange = (event: ChangeEvent, checked: boolean) => {
    const changedChapterList = chapterList.map(ranobe => {
      ranobe.checked = checked
      return ranobe
    })
    setChapterList(changedChapterList)
    setCheckAll(checked)
  }

  const download = async () => {
    await downloadRanobe()
  }

  const fetchChapters = async (reload?: boolean) => {
    const paramsT: IQuery = {
      href: params.id,
      reload
    }
    const title = new URLSearchParams(location.search).get('title') || undefined
    setTitle(title)
    if (title) paramsT.title = title

    try {
      setLoading(true)
      const response = (await infinitenoveltranslationsApi.get('/chapters', {
        cancelToken: request.token,
        params: paramsT,
        timeout: 0
      })) as IComposition

      if (response.chapters) {
        response.chapters.forEach(ranobe => (ranobe.checked = false))
        setChapterList(response.chapters)
      }
    } catch (error) {
      console.error(error)
      setSnackbar({
        message: 'Cannot fetch available chapters',
        show: true,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadRanobe = async () => {
    const ranobeHrefList = chapterList
      .filter(chapter => chapter.checked)
      .map(chapter => chapter.href)

    const downloadParams: IDownload = {
      ranobeHrefList,
      title
    }

    if (ranobeHrefList.length) {
      try {
        setLoading(true)
        const response = (await infinitenoveltranslationsApi.post(
          '/download',
          downloadParams,
          {
            cancelToken: request.token,
            timeout: 0,
            responseType: 'blob'
          }
        )) as Blob

        const blob = new Blob([response], { type: 'application/epub+zip' })
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')

        setSnackbar({
          message: 'Ranobe is generated',
          show: true,
          type: 'success'
        })
      } catch (error) {
        console.error(error)

        setSnackbar({
          message: 'Cannot download ranobe',
          show: true,
          type: 'error'
        })
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    return () => request.cancel()
  }, [])

  useEffect(() => {
    setChapterList([])
    fetchChapters()
  }, [location])

  return (
    <Container>
      <Box sx={{ display: 'flex', mb: '20px', flexWrap: 'wrap' }}>
        <FormGroup>
          <FormControlLabel
            label="Check all"
            control={
              <Checkbox
                color="primary"
                checked={checkAll}
                onChange={checkAllChange}
              />
            }
          ></FormControlLabel>
        </FormGroup>

        <Button
          disabled={loading || !chapterList.length}
          variant="contained"
          color="primary"
          size="small"
          sx={{ mr: '15px' }}
          onClick={download}
        >
          Download selected
        </Button>

        <Button
          disabled={loading}
          variant="contained"
          color="primary"
          size="small"
          onClick={() => fetchChapters(true)}
        >
          Reload
        </Button>
      </Box>

      <ChapterListComponent
        chapterList={chapterList}
        onCheck={onCheck}
        title={title}
      ></ChapterListComponent>
    </Container>
  )
}
