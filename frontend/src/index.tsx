import '@fontsource/roboto'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './index.scss'
import DefaultLayout from './layouts/default.layout'
import App from './pages/app/App'
import RanobeLibMe from './pages/ranobelibme'
import RanobeLibMeId from './pages/ranobelibme/ranobelibme-id'
import reportWebVitals from './reportWebVitals'

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

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {routes.map((route, i) => (
        <Route
          key={i}
          exact={route.subRoutes.some(r => r.exact)}
          path={route.subRoutes.map(r => r.path)}
        >
          <route.layout>
            {route.subRoutes.map((subRoute, i) => (
              <Route key={i} {...subRoute} />
            ))}
          </route.layout>
        </Route>
      ))}
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
