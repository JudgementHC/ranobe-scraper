import { Container } from '@mui/material'
import { useContext, useState } from 'react'
import RanobeListComponent from '../../components/ranobelist/RanobeList.component'
import { IRanobe } from '../../tools/responses/api.interface'
import { StoreContext } from '../../tools/store'

function RanobeLibMe(): JSX.Element {
  const [ranobeList, setRanobeList] = useState<IRanobe[]>([])
  const store = useContext(StoreContext)
  const [, setSnackbar] = store.snackbar

  return (
    <Container>
      <RanobeListComponent ranobeList={ranobeList}></RanobeListComponent>
    </Container>
  )
}

export default RanobeLibMe
