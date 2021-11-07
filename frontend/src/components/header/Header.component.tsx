import { ArrowBack, Home, Search } from '@material-ui/icons'
import {
  AppBar,
  Box,
  Button,
  Link as MaterialLink,
  Toolbar,
  Typography
} from '@mui/material'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import routes from '../../routes'
import ranobelibmeApi from '../../tools/axios/ranobelibme.api'
import { EServices } from '../../tools/enums/Services.enum'
import { ISearchResponse } from '../../tools/interfaces/Ranobelibme.interface'
import { StoreContext } from '../../tools/store'
import { TSearchType } from '../../tools/types/Ranobelibme.type'
import SearchComponent from '../search/Search.component'

interface Props {
  style: CSSProperties
}

export default function Header({ style }: Props): JSX.Element {
  const location = useLocation()
  const [modal, setModal] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<TSearchType>('manga')
  const currentRoute = location.pathname
  const store = useContext(StoreContext)
  const [, setSnackbar] = store.snackbar
  const [loading, setLoading] = store.loading
  const [result, setResult] = useState<ISearchResponse[]>([])

  const serviceName = currentRoute.split('/')[1]
  const withoutSearch = [EServices.INFINITENOVELTRANSLATIONS].includes(
    serviceName as EServices
  )

  const backLinkShow =
    !routes[0].subRoutes.find(route => route.path === currentRoute)?.service &&
    currentRoute !== '/'
  const searchIconShow = currentRoute !== '/'

  const submit = async (): Promise<void> => {
    if (title && !loading) {
      setLoading(true)
      try {
        const response: ISearchResponse[] = await ranobelibmeApi.get(
          '/search',
          {
            params: {
              title,
              type
            }
          }
        )

        setResult(response)
      } catch (error) {
        console.error(error)
        setSnackbar({
          message: "Can't find",
          show: true,
          type: 'error'
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode == 191) {
      event.preventDefault()
      setModal(true)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <AppBar style={style} position="relative" enableColorOnDark={true}>
      <Toolbar>
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          {backLinkShow && (
            <Box sx={{ mr: '20px' }}>
              <BackLink to={serviceName} closeEvent={() => setModal(false)} />
            </Box>
          )}

          <Link to="/" style={{ lineHeight: 1 }}>
            <Home style={{ color: 'white' }} fontSize="medium"></Home>
          </Link>

          {searchIconShow && (
            <Button
              onClick={() => setModal(true)}
              sx={{ ml: 'auto', color: 'white' }}
            >
              <Search fontSize="medium"></Search>
            </Button>
          )}
        </Box>
      </Toolbar>

      {withoutSearch && (
        <SearchComponent
          title={title}
          show={modal}
          type={type}
          typeChange={value => {
            setType(value)
            setResult([])
          }}
          closeEvent={() => setModal(false)}
          textFieldChange={value => setTitle(value)}
          result={result}
          submit={submit}
        ></SearchComponent>
      )}
    </AppBar>
  )
}

interface BackLinkProps {
  closeEvent: () => void
  to: string
}
function BackLink({ closeEvent, to }: BackLinkProps): JSX.Element {
  const router = useHistory()

  useEffect(() => {
    return () => closeEvent()
  }, [])

  return (
    <MaterialLink onClick={() => router.push(`/${to}`)} component="button">
      <Box display="flex" alignItems="center">
        <ArrowBack color="action"></ArrowBack>
        <Typography
          variant="h6"
          style={{ marginLeft: 5 }}
          color="textPrimary"
          noWrap
        >
          Back
        </Typography>
      </Box>
    </MaterialLink>
  )
}
