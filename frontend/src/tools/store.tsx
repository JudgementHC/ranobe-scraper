/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, FC, useState } from 'react'

interface IStore {
  [key: string]: any[]
}

export const StoreContext = createContext<IStore>({})

export const StoreProvider: FC = ({ children }) => {
  const teamMembersNames = ['John', 'Mary', 'Jason', 'David']
  const [team, setTeam] = useState(teamMembersNames)

  const store = {
    team: [team, setTeam]
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
