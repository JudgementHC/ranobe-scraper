import { ArrowBack, Search } from '@material-ui/icons'
import {
  AppBar,
  Box,
  Button,
  Link as MaterialLink,
  Toolbar,
  Typography
} from '@mui/material'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import apiAxios from '../../tools/axios'
import { ISearchResponse } from '../../tools/responses/api.interface'
import { StoreContext } from '../../tools/store'
import { TSearchType } from '../../tools/types/ranobelibme/SearchType.type'
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

  const submit = async (): Promise<void> => {
    const serviceName = currentRoute.split('/')[1]

    if (title && !loading) {
      setLoading(true)
      try {
        const response: ISearchResponse[] = await apiAxios.get('/search', {
          params: {
            title,
            type
          }
        })

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
        <Box sx={{ display: 'flex', width: '100%' }}>
          {currentRoute !== '/' && (
            <>
              <BackLink closeEvent={() => setModal(false)} />

              <Button
                onClick={() => setModal(true)}
                style={{ marginLeft: 'auto', color: 'white' }}
              >
                <Search fontSize="medium"></Search>
              </Button>
            </>
          )}
        </Box>
      </Toolbar>

      {/* todo: необходимо добавить teleporter */}
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
    </AppBar>
  )
}

interface BackLinkProps {
  closeEvent: () => void
}
function BackLink({ closeEvent }: BackLinkProps): JSX.Element {
  const router = useHistory()

  useEffect(() => {
    return () => closeEvent()
  }, [])

  return (
    <MaterialLink onClick={router.goBack} component="button">
      <Box display="flex" alignItems="center">
        <ArrowBack color="action"></ArrowBack>
        <Typography
          variant="h6"
          style={{ marginLeft: 15 }}
          color="textPrimary"
          noWrap
        >
          Back
        </Typography>
      </Box>
    </MaterialLink>
  )
}
