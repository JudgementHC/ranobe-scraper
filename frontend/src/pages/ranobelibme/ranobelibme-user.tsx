import { Container, Typography } from '@mui/material'
import axios, { CancelToken } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import RanobeListComponent from '../../components/ranobelist/RanobeList.component'
import apiAxios from '../../tools/axios'
import { IRanobe } from '../../tools/responses/api.interface'
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

  useEffect(() => {
    const userId = +params.id || 0

    getRanobe(userId, request.token, setRanobeList, setLoading)

    return () => request.cancel()
  }, [])

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

async function getRanobe(
  userId: number,
  token: CancelToken,
  setRanobe: (ranobe: IRanobe[]) => void,
  setLoading: (value: boolean) => void
) {
  setLoading(true)
  try {
    const response: IRanobe[] = await apiAxios.get('/ranobeList', {
      cancelToken: token,
      params: {
        userId
      }
    })

    setRanobe(response)
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}
