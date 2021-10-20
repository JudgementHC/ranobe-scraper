import { useParams } from 'react-router'

interface Params {
  id: string
}
export default function RanobeLibMeUser(): JSX.Element {
  const params = useParams<Params>()

  return (
    <div>
      <h4> this is user page</h4>
      <p> user id: ${params.id} </p>
    </div>
  )
}
