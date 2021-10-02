import { Box, Button, Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const ranobeServiceList = [
  {
    href: '/ranobelibme',
    title: 'Ranobelibme'
  }
]

function App(): JSX.Element {
  return (
    <Container>
      <Typography variant="h4" style={{ marginBottom: '30px' }}>
        Services:
      </Typography>

      <Box sx={{ display: 'flex' }}>
        {ranobeServiceList.map((service, index) => (
          <Link key={index} to={service.href}>
            <Button variant="contained" color="primary">
              {service.title}
            </Button>
          </Link>
        ))}
      </Box>
    </Container>
  )
}

export default App
