/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, FC, useState } from 'react'
import { ISnackbar } from './interfaces/Snackbar.interface'

interface IStore {
  [key: string]: any[]
}

export const StoreContext = createContext<IStore>({})

export const StoreProvider: FC = ({ children }) => {
  const [snackbar, setSnackbar] = useState<ISnackbar>({
    show: false
  })

  const store = {
    snackbar: [snackbar, setSnackbar]
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
