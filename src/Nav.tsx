import { For } from 'solid-js'
import { A } from '@solidjs/router'
import { routesList } from './routes'
import './nav.scss'

export default function Nav() {
  const routes = routesList()

  // 过滤出导航项
  const navItems = () =>
    routes.filter(
      (route) =>
        !route.path.includes(':') && route.path !== '*' && route.path !== '/404'
    )

  return (
    <nav class="nav-container">
      <ul class="nav-list">
        <For each={navItems()}>
          {(route) => (
            <li>
              <A
                href={route.path}
                class="nav-link"
                activeClass="active"
                end={route.path === '/'}
              >
                {route.title}
              </A>
            </li>
          )}
        </For>
      </ul>
    </nav>
  )
}
