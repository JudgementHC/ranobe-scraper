import { Container } from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import LoginComponent from '../../components/login/Login.component'
import { MessageContext } from '../../components/message/Message.component'
import RanobeListComponent from '../../components/ranobelist/RanobeList.component'
import apiAxios from '../../tools/axios'
import { ILoginForm } from '../../tools/interfaces/Ranobelibme.interface'
import { IRanobe, IUser } from '../../tools/responses/api.interface'

function RanobeLibMe(): JSX.Element {
  const request = axios.CancelToken.source()

  const [ranobeList, setRanobeList] = useState<IRanobe[]>([])
  const [, setSnackbar] = useContext(MessageContext)

  const loginOnSubmit = async (data: ILoginForm) => {
    try {
      const response: IUser = await apiAxios.post('/login', data, {
        cancelToken: request.token
      })
      setSnackbar({
        show: true,
        type: 'success',
        message: `Login success. Email: ${response.email}`
      })
    } catch (error) {
      console.error(error)
      setSnackbar({
        show: true,
        type: 'error',
        message: 'Cannot login'
      })
    }
  }

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
      <LoginComponent
        show={true}
        submit={loginOnSubmit}
        style={{ marginBottom: 15 }}
      ></LoginComponent>

      <RanobeListComponent ranobeList={ranobeList}></RanobeListComponent>
    </Container>
  )
}

export default RanobeLibMe
