import { Container, Typography } from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import RanobeListComponent from '../../components/ranobelist/RanobeList.component'
import apiAxios from '../../tools/axios'
import { ISnackbar } from '../../tools/interfaces/Snackbar.interface'
import { IRanobe } from '../../tools/responses/api.interface'
import { StoreContext } from '../../tools/store'

const request = axios.CancelToken.source()

export default function RanobeLibMe(): JSX.Element {
  const [ranobeList, setRanobeList] = useState<IRanobe[]>([])
  const store = useContext(StoreContext)
  const [, setSnackbar] = store.snackbar
  const [loading, setLoading] = store.loading

  useEffect(() => {
    const getLocalRanobe = async (): Promise<void> => {
      setLoading(true)

      try {
        const response: IRanobe[] = await apiAxios.get('/ranobeList', {
          cancelToken: request.token,
          params: {
            local: true
          }
        })
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
        <RanobeListComponent ranobeList={ranobeList}></RanobeListComponent>
      ) : (
        !loading && <Typography variant="h6">local list is empty</Typography>
      )}
    </Container>
  )
}
