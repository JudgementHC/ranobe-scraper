import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup
} from '@mui/material'
import axios, { CancelTokenSource } from 'axios'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import ChapterListComponent from '../../components/chapterlist/ChapterList.component'
import {
  IMessageFunction,
  MessageContext
} from '../../components/message/Message.component'
import apiAxios from '../../tools/axios'
import {
  IRanobelibmeIdDownload,
  IRanobelibmeIdQuery
} from '../../tools/interfaces/Ranobelibme.interface'
import { Chapter } from '../../tools/responses/api.interface'

interface Params {
  id: string
}

let ranobeTitle: string

export default function RanobeLibMeId(): JSX.Element {
  const [checkAll, setCheckAll] = useState(false)
  const [chapterList, setChapterList] = useState<Chapter[]>([])
  const params = useParams<Params>()
  const location = useLocation()
  const [, setSnackbar] = useContext(MessageContext)
  const request = axios.CancelToken.source()

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
    await downloadRanobe(chapterList, ranobeTitle, setSnackbar, request)
  }

  useEffect(() => {
    const paramsT: IRanobelibmeIdQuery = {
      href: params.id
    }
    ranobeTitle =
      new URLSearchParams(location.search).get('title') || 'empty title'
    if (ranobeTitle) paramsT.title = ranobeTitle

    const fetchChapters = async () => {
      try {
        const response = (await apiAxios.get('/availableChapters', {
          cancelToken: request.token,
          params: paramsT
        })) as Chapter[]
        if (response) {
          response.forEach(ranobe => (ranobe.checked = false))
          setChapterList(response)
        }
      } catch (error) {
        console.error(error)
        setSnackbar({
          message: 'Cannot fetch available chapters',
          show: true,
          type: 'error'
        })
      }
    }

    fetchChapters()

    return () => request.cancel()
  }, [])

  return (
    <Container>
      <Box display="flex">
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
          variant="contained"
          color="primary"
          size="small"
          onClick={download}
        >
          Download selected
        </Button>
      </Box>

      <ChapterListComponent
        chapterList={chapterList}
        onCheck={onCheck}
      ></ChapterListComponent>
    </Container>
  )
}

async function downloadRanobe(
  chapterList: Chapter[],
  title: string,
  setSnackbar: IMessageFunction,
  request: CancelTokenSource
) {
  const ranobeHrefList = chapterList
    .filter(chapter => chapter.checked)
    .map(chapter => chapter.href)

  const downloadParams: IRanobelibmeIdDownload = {
    ranobeHrefList,
    title
  }

  if (ranobeHrefList.length) {
    try {
      const response = await apiAxios.post('/download', downloadParams, {
        cancelToken: request.token
      })

      setSnackbar({
        message: `Ranobe downloaded, server response: ${response}`,
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
    }
  }
}
