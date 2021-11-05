import { Box, Button, Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { EServices } from '../tools/enums/Services.enum'

const ranobeServiceList = [
  {
    href: '/ranobelibme',
    title: EServices.RANOBELIBME
  },
  {
    href: '/infinitenoveltranslations',
    title: EServices.INFINITENOVELTRANSLATIONS
  }
]

export default function App(): JSX.Element {
  return (
    <Container>
      <Typography variant="h4" style={{ marginBottom: '30px' }}>
        Services:
      </Typography>

      <Box sx={{ display: 'flex' }}>
        {ranobeServiceList.map((service, index) => (
          <Link tabIndex={-1} key={index} to={service.href} style={{ marginRight: '15px' }}>
            <Button variant="contained" color="primary">
              {service.title}
            </Button>
          </Link>
        ))}
      </Box>
    </Container>
  )
}
