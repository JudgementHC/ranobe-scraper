import { RequestHandler } from 'express'

export const isAuthorized: RequestHandler = (req, res, next) => {
  const { cookie } = req.headers
  const cookieList = cookie?.split(';')

  const isAuth = cookieList?.find(
    cookie => cookie.split('=')[0] === 'XSRF-TOKEN'
  )

  if (isAuth) {
    return next()
  }

  return res.status(401).json({ message: 'Authorization error' })
}

/* for (const prop in req.headers) {
  if (prop.startsWith('ranobelib-auth')) {
    const cookie: Protocol.Network.Cookie = JSON.parse(
      req.headers[prop] as string
    )
  }
} */
