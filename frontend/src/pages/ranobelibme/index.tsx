import { Container } from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import RanobeListComponent from '../../components/ranobelist/RanobeList.component'
import apiAxios from '../../tools/axios'
import { IRanobe } from '../../tools/responses/api.interface'
import { StoreContext } from '../../tools/store'

function RanobeLibMe(): JSX.Element {
  const request = axios.CancelToken.source()

  const [ranobeList, setRanobeList] = useState<IRanobe[]>([])
  const store = useContext(StoreContext)
  const [, setSnackbar] = store.snackbar

  useEffect(() => {
    const fetchRanobe = async () => {
      try {
        const response = (await apiAxios.get('/localRanobeList', {
          cancelToken: request.token
        })) as IRanobe[]
        if (response) {
          setRanobeList(response)
        }
      } catch (error) {
        console.error(error)
        setSnackbar({
          show: true,
          type: 'error',
          message: 'Cannot fetch ranobe list'
        })
      }
    }

    fetchRanobe()

    return () => request.cancel()
  }, [])

  return (
    <Container>
      <RanobeListComponent ranobeList={ranobeList}></RanobeListComponent>
    </Container>
  )
}

export default RanobeLibMe
