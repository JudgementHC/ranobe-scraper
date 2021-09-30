import { Container } from '@material-ui/core'
import { useParams } from 'react-router-dom'

export default function RanobeLibMeId(): JSX.Element {
  const params = useParams<{ id: string }>()

  return (
    <Container>
      <h4>{params.id}</h4>
    </Container>
  )
}
