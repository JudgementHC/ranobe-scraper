import DefaultLayout from '../layouts/default.layout'
import App from '../pages/app/App'
import RanobeLibMe from '../pages/ranobelibme'
import RanobeLibMeId from '../pages/ranobelibme/ranobelibme-id'
import RanobeLibMeUser from '../pages/ranobelibme/ranobelibme-user'

const routes = [
  {
    layout: DefaultLayout,
    subRoutes: [
      {
        path: '/',
        exact: true,
        component: App
      },
      {
        path: '/ranobelibme',
        exact: true,
        component: RanobeLibMe
      },
      {
        path: '/ranobelibme/ranobe/:id',
        exact: false,
        component: RanobeLibMeId
      },
      {
        path: '/ranobelibme/user/:id',
        exact: false,
        component: RanobeLibMeUser
      }
    ]
  }
]

export default routes
