import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery
} from '@material-ui/core'
import { useMemo } from 'react'

const DefaultLayout: React.FC<unknown> = props => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light'
        }
      }),
    [prefersDarkMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline></CssBaseline>

      <header>header</header>

      <main>{props.children}</main>

      <footer>footer</footer>
    </ThemeProvider>
  )
}

export default DefaultLayout
