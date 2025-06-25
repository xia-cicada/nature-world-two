// src/App.tsx
import { Router, Route } from '@solidjs/router'
import { routesList } from './routes'
import { For } from 'solid-js'
import Nav from './Nav'
import { render } from 'solid-js/web'
import './index.scss'

render(
  () => (
    <Router>
      <Route path="/" component={Nav}></Route>
      <For each={routesList()}>
        {(route) => (
          <Route path={route.path} component={route.component}></Route>
        )}
      </For>
      <Route path="*" component={() => <div>Not Found</div>}></Route>
    </Router>
  ),
  document.getElementById('root')!
)
