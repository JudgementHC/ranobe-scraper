/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, FC, useState } from 'react'
import { ISnackbar } from './interfaces/Snackbar.interface'
import { IRanobe } from './interfaces/API.interface'

interface IStore {
  [key: string]: any[]
}

export const StoreContext = createContext<IStore>({})

export const StoreProvider: FC = ({ children }) => {
  const [snackbar, setSnackbar] = useState<ISnackbar>({
    show: false
  })
  const [loading, setLoading] = useState(false)
  const [currentRanobe, setCurrentRanobe] = useState<IRanobe>()

  const store = {
    snackbar: [snackbar, setSnackbar],
    loading: [loading, setLoading],
    currentRanobe: [currentRanobe, setCurrentRanobe]
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
