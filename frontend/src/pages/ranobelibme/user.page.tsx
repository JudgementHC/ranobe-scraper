import { Container, Typography } from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import RanobeListComponent from '../../components/ranobelist/RanobeList.component'
import apiAxios from '../../tools/axios'
import { IRanobe } from '../../tools/interfaces/API.interface'
import { StoreContext } from '../../tools/store'

interface Params {
  id: string
}
export default function RanobeLibMeUser(): JSX.Element {
  const params = useParams<Params>()
  const request = axios.CancelToken.source()
  const store = useContext(StoreContext)
  const [loading, setLoading] = store.loading
  const [ranobeList, setRanobeList] = useState<IRanobe[]>([])
  const location = useLocation()

  const getRanobe = async () => {
    setLoading(true)
    try {
      const response: IRanobe[] = await apiAxios.get('/ranobeList', {
        cancelToken: request.token,
        params: {
          userId: +params.id || 0
        }
      })

      setRanobeList(response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    return () => request.cancel()
  }, [])

  useEffect(() => {
    getRanobe()
  }, [location])

  return (
    <Container>
      <Typography sx={{ mb: '15px' }} variant="h4">
        User id: {params.id}
      </Typography>

      {ranobeList.length ? (
        <RanobeListComponent ranobeList={ranobeList}></RanobeListComponent>
      ) : (
        !loading && (
          <Typography variant="h6">user ranobe list is empty</Typography>
        )
      )}
    </Container>
  )
}
