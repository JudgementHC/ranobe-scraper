import { Container } from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { MessageContext } from '../../components/message/Message.component'
import RanobeListComponent from '../../components/ranobelist/RanobeList.component'
import apiAxios from '../../tools/axios'
import { IRanobe } from '../../tools/responses/api.interface'

function RanobeLibMe(): JSX.Element {
  const [ranobeList, setRanobeList] = useState<IRanobe[]>([])
  const [, setSnackbar] = useContext(MessageContext)

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
