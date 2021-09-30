import { Box, Container } from '@material-ui/core'
import { CSSProperties } from 'react'

interface Props {
  style: CSSProperties
}

export default function Footer({ style }: Props): JSX.Element {
  return (
    <Box component="footer" style={style}>
      <Container>this is footer</Container>
    </Box>
  )
}
