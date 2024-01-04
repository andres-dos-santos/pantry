import { Outlet } from 'react-router-dom'

import { Logo } from '../components/logo'

export function Layout() {
  return (
    <>
      <header className="flex items-center justify-between px-10 h-20 sm:mx-auto sm:max-w-[800px]">
        <Logo />

        <div className="flex items-center space-x-2.5">
          <span className="text-xs font-medium">ANDRES</span>
          <div className="h-10 w-10 rounded-full border border-zinc-200 flex items-center justify-center" />
        </div>
      </header>

      <div className="sm:mx-auto sm:max-w-[800px]">
        <Outlet />
      </div>
    </>
  )
}
