import { Box, Container } from '@mui/material'
import { CSSProperties } from 'react'

interface Props {
  style: CSSProperties
}

export default function Footer({ style }: Props): JSX.Element {
  return (
    <Box component="footer" style={style}>
      <Container></Container>
    </Box>
  )
}
