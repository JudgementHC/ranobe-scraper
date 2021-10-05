import { Alert, Snackbar } from '@mui/material'
import { useContext } from 'react'
import { ISnackbar } from '../../tools/interfaces/Snackbar.interface'
import { StoreContext } from '../../tools/store'

export default function MessageComponent(): JSX.Element {
  const store = useContext(StoreContext)
  const [snackbar, setSnackbar] = store.snackbar

  const handleClose = () =>
    setSnackbar((prev: ISnackbar) => ({
      ...prev,
      show: false
    }))

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={snackbar.show}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={snackbar.type}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  )
}
