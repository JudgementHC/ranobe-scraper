import { FC } from 'react'

export interface IRoute {
  layout: FC<unknown>
  subRoutes: ISubroute[]
}

export interface ISubroute {
  path: string
  exact?: boolean
  component: () => JSX.Element
  service?: boolean
}
