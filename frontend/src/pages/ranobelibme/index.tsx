import { Container } from '@material-ui/core'
import axios from 'axios'
import { useEffect, useState } from 'react'
import RanobeListComponent from '../../components/ranobelist/RanobeList.component'
import apiAxios from '../../tools/axios'
import { IRanobe } from '../../tools/responses/api.interface'

function RanobeLibMe(): JSX.Element {
  const [ranobeList, setRanobeList] = useState<IRanobe[]>([])

  useEffect(() => {
    const request = axios.CancelToken.source()

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
