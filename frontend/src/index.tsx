import '@fontsource/roboto'
import React from 'react'
import ReactDOM from 'react-dom'
import { MemoryRouter, Route, Switch } from 'react-router'
import './index.scss'
import DefaultLayout from './layouts/default.layout'
import App from './pages/app/App'
import reportWebVitals from './reportWebVitals'

const routes = [
  {
    layout: DefaultLayout,
    subRoutes: [
      {
        path: '/',
        exact: true,
        component: App
      }
    ]
  }
]

ReactDOM.render(
  <React.StrictMode>
    <MemoryRouter>
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
    </MemoryRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
