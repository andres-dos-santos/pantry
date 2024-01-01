import { Outlet } from 'react-router-dom'

import { Menu } from '../components/menu'
import { Logo } from '../components/logo'

export function Layout() {
  return (
    <>
      <header className="flex items-center justify-between px-10 h-20">
        <div className="flex items-center gap-x-5">
          <Menu />

          <Logo />
        </div>

        <div className="flex items-center space-x-2.5">
          <span className="text-xs font-medium">ANDRES</span>
          <div className="h-10 w-10 rounded-full border border-zinc-200 flex items-center justify-center" />
        </div>
      </header>

      <Outlet />
    </>
  )
}
