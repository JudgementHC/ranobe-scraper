import DefaultLayout from '../layouts/default.layout'
import App from '../pages/app/App'
import RanobeLibMe from '../pages/ranobelibme'
import RanobeLibMeId from '../pages/ranobelibme/ranobelibme-id'

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
        path: '/ranobelibme/:id',
        exact: false,
        component: RanobeLibMeId
      }
    ]
  }
]

export default routes
