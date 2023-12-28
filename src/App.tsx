import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import { supabase } from './lib/supabase'

import { CreateProduct } from './components/create-product'

import 'dayjs/locale/pt-br'

interface Pantry {
  id: number
  created_at: string
  product_name: string
  product_quantity: number
  product_suffix: string
  product_tag: string
  in_use: boolean
  product_price: number
  updated_at: string
  expiration_date: string
}

const currentDate = dayjs(new Date()).locale('pt-br').format('MMMM [de] YYYY')

export default function App() {
  const [pantry, setPantry] = useState<Pantry[]>([])

  useEffect(() => {
    supabase
      .from('pantry')
      .select('*')
      .then((response) => setPantry(response.data as Pantry[]))
  }, [])

  return (
    <>
      <div className="flex flex-col h-full items-start justify-center">
        <header className="flex items-center justify-between w-full p-5 border-b border-b-zinc-200">
          <h1 className="text-[15px] sm:text-[24px] font-medium uppercase -tracking-wide">
            {currentDate}
          </h1>

          <CreateProduct />
        </header>

        <ul className="grid grid-cols-2 gap-2.5 sm:gap-5 sm:grid-cols-4 mt-5 sm:mt-10 p-5">
          {pantry?.map((i) => (
            <li
              key={i.id}
              className="border border-zinc-200 rounded-sm p-5 bg-zinc-100/50 cursor-pointer"
            >
              <p className="text-sm font-bold -tracking-wider uppercase truncate">
                {i.product_name}
              </p>

              <div className="flex items-center my-2.5 space-x-2">
                <p className="text-sm font-medium -tracking-wider uppercase">
                  {i.product_quantity}
                  {i.product_suffix}
                </p>

                {i.in_use ? (
                  <span className="h-5 flex items-center justify-center px-1 bg-green-500 text-white text-xs font-medium">
                    aberto
                  </span>
                ) : (
                  <span className="h-5 flex items-center justify-center px-1 bg-red-500 text-white text-xs font-medium">
                    fechado
                  </span>
                )}
              </div>

              <p className="sm:before:content-['vence_'] text-xs -tracking-wider text-zinc-400">
                em{' '}
                <span className="font-semibold">
                  {dayjs(i.expiration_date).diff(new Date(), 'day')}
                </span>{' '}
                dias
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
