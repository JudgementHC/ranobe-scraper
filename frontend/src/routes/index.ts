import DefaultLayout from '../layouts/default.layout'
import HomePage from '../pages/Home.page'
import RanobeLibMe from '../pages/ranobelibme/index.page'
import RanobeLibMeId from '../pages/ranobelibme/id.page'
import RanobeLibMeUser from '../pages/ranobelibme/user.page'

const routes = [
  {
    layout: DefaultLayout,
    subRoutes: [
      {
        path: '/',
        exact: true,
        component: HomePage
      },
      {
        path: '/ranobelibme',
        exact: true,
        component: RanobeLibMe,
        service: true
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
