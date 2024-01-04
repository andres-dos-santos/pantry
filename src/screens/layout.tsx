import { Outlet } from 'react-router-dom'

import { Logo } from '../components/logo'

export function Layout() {
  return (
    <>
      <header className="flex items-center justify-between sm:border-b border-zinc-200 px-10 h-20 sm:ml-96 sm:w-[calc(100%_-_24rem)]">
        <div className="flex items-center gap-x-5">
          <div className="sm:hidden">
            <Logo />
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <span className="text-xs font-medium">ANDRES</span>
          <div className="h-10 w-10 rounded-full border border-zinc-200 flex items-center justify-center" />
        </div>
      </header>

      <div className="sm:ml-96 sm:w-[calc(100%_-_24rem)]">
        <Outlet />
      </div>
    </>
  )
}
