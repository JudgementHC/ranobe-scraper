import { Alert, AlertColor, Snackbar } from '@mui/material'
import { createContext, useState } from 'react'

interface ISnackbar {
  show: boolean
  message?: string
  type?: AlertColor
}
export type IMessageFunction = (params: ISnackbar) => void

const MessageContext = createContext<[ISnackbar, IMessageFunction]>([
  { show: false },
  () => ({})
])

const MessageProvider: React.FC = props => {
  const [snackbar, setSnackbar] = useState<ISnackbar>({
    show: false
  })

  const handleClose = () =>
    setSnackbar(prev => ({
      ...prev,
      show: false
    }))

  return (
    <MessageContext.Provider value={[snackbar, setSnackbar]}>
      {props.children}

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
    </MessageContext.Provider>
  )
}

export { MessageContext, MessageProvider }
