import DefaultLayout from '../layouts/default.layout'
import HomePage from '../pages/Home.page'
import InfinitenoveltranslationsId from '../pages/infinitenoveltranslations/id.page'
import RanobeLibMeId from '../pages/ranobelibme/id.page'
import RanobeLibMeUser from '../pages/ranobelibme/user.page'
import ServicePage from '../pages/Service.page'
import { EServices } from '../tools/enums/Services.enum'
import { IRoute } from '../tools/interfaces/Common.interface'

const { INFINITENOVELTRANSLATIONS, RANOBELIBME } = EServices

const routes: IRoute[] = [
  {
    layout: DefaultLayout,
    subRoutes: [
      {
        path: '/',
        exact: true,
        component: HomePage
      },

      {
        path: '/:service',
        exact: true,
        component: ServicePage,
        service: true
      },

      {
        path: `/${RANOBELIBME}/ranobe/:id`,
        component: RanobeLibMeId
      },
      {
        path: `/${RANOBELIBME}/user/:id`,
        component: RanobeLibMeUser
      },

      {
        path: `/${INFINITENOVELTRANSLATIONS}/ranobe/:id`,
        component: InfinitenoveltranslationsId
      }
    ]
  }
]

export default routes
