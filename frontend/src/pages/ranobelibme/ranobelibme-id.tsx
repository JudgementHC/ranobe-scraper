import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Typography
} from '@mui/material'
import axios from 'axios'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import ChapterListComponent from '../../components/chapterlist/ChapterList.component'
import apiAxios from '../../tools/axios'
import {
  IRanobelibmeIdDownload,
  IRanobelibmeIdQuery
} from '../../tools/interfaces/Ranobelibme.interface'
import { IChapter } from '../../tools/responses/api.interface'
import { StoreContext } from '../../tools/store'
import { yellow } from '@mui/material/colors'
import { TGetChapters } from '../../tools/responses/api.type'

interface Params {
  id: string
}

export default function RanobeLibMeId(): JSX.Element {
  const [checkAll, setCheckAll] = useState(false)
  const [chapterList, setChapterList] = useState<IChapter[]>([])
  const params = useParams<Params>()
  const location = useLocation()
  const store = useContext(StoreContext)
  const [, setSnackbar] = store.snackbar
  const [loading, setLoading] = store.loading
  const request = axios.CancelToken.source()
  const [translate, setTranslate] = useState<string[]>([])
  const [curTranslate, setCurTranslate] = useState<string>()
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

  const fetchChapters = async (reload?: boolean, translate?: string) => {
    const paramsT: IRanobelibmeIdQuery = {
      href: params.id,
      reload,
      translate
    }
    const title = new URLSearchParams(location.search).get('title') || undefined
    setTitle(title)
    if (title) paramsT.title = title

    try {
      setLoading(true)
      const response = (await apiAxios.get('/chapters', {
        cancelToken: request.token,
        params: paramsT,
        timeout: 0
      })) as TGetChapters
      const responseT = response as unknown as string[]

      if (response.chapters) {
        response.chapters.forEach(ranobe => (ranobe.checked = false))
        setChapterList(response.chapters)
      } else if (responseT.length) {
        console.info(responseT)
        setTranslate(responseT.map(el => el.trim()))
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

    const downloadParams: IRanobelibmeIdDownload = {
      ranobeHrefList,
      title
    }

    if (ranobeHrefList.length) {
      try {
        setLoading(true)
        const response = (await apiAxios.post('/download', downloadParams, {
          cancelToken: request.token,
          timeout: 0,
          responseType: 'blob'
        })) as Blob

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

  const isActiveTranslate = (translate: string): boolean =>
    curTranslate === translate

  useEffect(() => {
    return () => request.cancel()
  }, [])

  useEffect(() => {
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
          disabled={loading}
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

      {!!translate.length && (
        <>
          <Typography mb="10px" variant="h6">
            Translates:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: '20px' }}>
            {translate.map((el, index) => (
              <Button
                variant="outlined"
                sx={{
                  mr: '10px',
                  bgcolor: isActiveTranslate(el) ? yellow[800] : '',
                  color: isActiveTranslate(el) ? 'white' : ''
                }}
                key={index}
                onClick={() => {
                  setCurTranslate(el)
                  fetchChapters(true, el)
                }}
                disabled={loading}
              >
                {el}
              </Button>
            ))}
          </Box>
        </>
      )}

      <ChapterListComponent
        chapterList={chapterList}
        onCheck={onCheck}
        title={title}
      ></ChapterListComponent>
    </Container>
  )
}
