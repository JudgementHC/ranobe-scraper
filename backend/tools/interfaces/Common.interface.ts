import Protocol from 'devtools-protocol'
import { ERanobeServices } from '../enums/Services.enum'

export interface Sessions {
  [key: string]: ERanobeServices
}

export interface SessionParams {
  cookies: Protocol.Network.Cookie[]
}
