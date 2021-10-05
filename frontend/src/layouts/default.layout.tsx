import {
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery
} from '@mui/material'
import { blue } from '@mui/material/colors'
import { CSSProperties, useMemo } from 'react'
import Footer from '../components/footer/Footer.component'
import Header from '../components/header/Header.component'

const headerFooterStyles: CSSProperties = { flex: '0 1 auto' }

const DefaultLayout: React.FC<unknown> = props => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: blue[800]
          }
        }
      }),
    [prefersDarkMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline></CssBaseline>

      <Box
        sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}
      >
        <Header style={headerFooterStyles}></Header>

        <Box sx={{ marginY: '30px', flex: '1 0 auto' }}>
          <main>{props.children}</main>
        </Box>

        <Footer style={headerFooterStyles}></Footer>
      </Box>
    </ThemeProvider>
  )
}

export default DefaultLayout
