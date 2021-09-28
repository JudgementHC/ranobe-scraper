import { Container } from '@material-ui/core'
import { useEffect, useState } from 'react'
import ListComponent from '../../components/list/List.component'
import apiAxios from '../../tools/axios'
import { IRanobe } from '../../tools/responses/api.interface'

function App(): JSX.Element {
  const [ranobeList, setRanobeList] = useState<IRanobe[]>([])

  useEffect(() => {
    const fetchRanobe = async () => {
      const response = (await apiAxios.get('/localRanobeList')) as IRanobe[]
      setRanobeList(response)
    }
    fetchRanobe()
  }, [])

  return (
    <Container>
      <ListComponent ranobeList={ranobeList}></ListComponent>
    </Container>
  )
}

export default App
