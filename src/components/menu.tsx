import { useState } from 'react'
import { AlignJustify, X } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Logo } from './logo'

const ROUTES = [
  { to: '/pantry', name: 'DESPENSA' },
  { to: '/shopping-list', name: 'LISTA DE COMPRAS' },
]

export function Menu() {
  const [menu, setMenu] = useState(false)

  return (
    <>
      <button onClick={() => setMenu((prev) => !prev)}>
        <AlignJustify className="w-4 h-4" />
      </button>

      <aside
        data-show={menu}
        className="data-[show=true]:flex flex-col data-[show=false]:hidden z-50 fixed left-0 right-0 top-0 bottom-0 bg-white h-screen w-screen"
      >
        <header className="flex items-center justify-between px-10 h-20">
          <div className="flex items-center gap-x-5">
            <button onClick={() => setMenu((prev) => !prev)}>
              <X className="w-4 h-4" />
            </button>

            <Logo />
          </div>
        </header>

        <ul className="px-10 mt-10 flex flex-col gap-y-5">
          {ROUTES.map((item) => (
            <li
              key={item.name}
              className="font-medium text-sm"
              onClick={() => setMenu((prev) => !prev)}
            >
              <Link to={item.to}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}
