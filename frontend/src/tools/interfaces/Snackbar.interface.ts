import { AlertColor } from '@mui/material'

export interface ISnackbar {
  show: boolean
  message?: string
  type?: AlertColor
}
