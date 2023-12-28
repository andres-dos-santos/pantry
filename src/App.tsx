import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { ChevronDown } from 'lucide-react'

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

const currentDate = dayjs(new Date()).locale('pt-br').format('MMMM')

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
      <div className="max-w-[800px] mx-auto flex flex-col h-full items-start justify-center">
        <header className="flex items-center justify-between w-full py-5">
          <div className="flex items-center justify-center space-x-4">
            <h1 className="text-[15px] sm:text-[24px] font-medium uppercase -tracking-wide">
              PAN<span className="text-orange-500">TRY</span>
            </h1>

            <button className="flex items-center justify-center space-x-1 h-10 -tracking-wide text-[12px] uppercase font-medium pr-4 pl-5 hover:bg-zinc-200/50 transition-all duration-200 bg-zinc-100 rounded-full">
              <span>{currentDate}</span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          <CreateProduct />
        </header>

        <ul className="mt-5 sm:mt-10 w-full">
          {pantry?.map((i) => (
            <li key={i.id} className="border-b border-b-zinc-200 py-5 w-full">
              <div className="flex items-center my-2.5 space-x-2">
                {i.in_use ? (
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                ) : (
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                )}
                <span className="text-[15px] font-medium -tracking-wider uppercase truncate">
                  {i.product_name}
                </span>
              </div>

              <div className="flex items-center my-2.5 space-x-2">
                <p className="text-sm font-medium -tracking-wider uppercase">
                  {i.product_quantity}
                  {i.product_suffix}
                </p>
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
