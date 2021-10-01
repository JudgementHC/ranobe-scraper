import {
  AppBar,
  Box,
  Link as MaterialLink,
  Toolbar,
  Typography
} from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import { CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface Props {
  style: CSSProperties
}

export default function Header({ style }: Props): JSX.Element {
  const location = useLocation()

  return (
    <AppBar style={style} position="relative">
      <Toolbar>{location.pathname !== '/' && <BackLink />}</Toolbar>
    </AppBar>
  )
}

function BackLink(): JSX.Element {
  const location = useLocation()
  const paths = location.pathname.split('/')
  paths.pop()
  const previousRoute = paths.join('/')

  return (
    <Link to={previousRoute}>
      <MaterialLink component="button">
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
    </Link>
  )
}
