import { Container, Typography } from '@mui/material'
import axios, { CancelTokenSource } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import RanobeListComponent from '../components/ranobelist/RanobeList.component'
import infinitenoveltranslationsApi from '../tools/axios/infinitenoveltranslations.api'
import ranobelibmeApi from '../tools/axios/ranobelibme.api'
import { EServices, EServiceUrls } from '../tools/enums/Services.enum'
import { IRanobe } from '../tools/interfaces/API.interface'
import { ISnackbar } from '../tools/interfaces/Snackbar.interface'
import { StoreContext } from '../tools/store'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api: any = {
  ranobelibmeApi,
  infinitenoveltranslationsApi
}

export default function ServicePage(): JSX.Element {
  const [ranobeList, setRanobeList] = useState<IRanobe[]>([])
  const store = useContext(StoreContext)
  const [, setSnackbar] = store.snackbar
  const [loading, setLoading] = store.loading
  let request: CancelTokenSource
  const location = useLocation()
  const serviceName = location.pathname.replace('/', '')
  const apiName = `${serviceName}Api`

  useEffect(() => {
    const getLocalRanobe = async (): Promise<void> => {
      setLoading(true)

      try {
        request = axios.CancelToken.source()
        const response: IRanobe[] = await api[apiName].get('/ranobeList', {
          cancelToken: request.token,
          params: {
            local: true
          }
        })
        if (serviceName === EServices.RANOBELIBME) {
          response.forEach(el => {
            el.cover = `${EServiceUrls.STATICLIB}/${el.cover}`
          })
        }
        setRanobeList(response)
      } catch (error) {
        console.error(error)
        setSnackbar({
          message: 'Server error: can not get ranobe list',
          type: 'error',
          show: true
        } as ISnackbar)
      } finally {
        setLoading(false)
      }
    }

    getLocalRanobe()

    return () => request.cancel()
  }, [])

  return (
    <Container>
      <Typography sx={{ mb: '15px' }} variant="h4">
        Local list:
      </Typography>

      {ranobeList.length ? (
        <RanobeListComponent
          ranobeList={ranobeList}
          service={serviceName}
        ></RanobeListComponent>
      ) : (
        !loading && <Typography variant="h6">local list is empty</Typography>
      )}
    </Container>
  )
}
