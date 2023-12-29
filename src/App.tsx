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

const currentDate = dayjs(new Date()).locale('pt-br').format('MMM DD')

export default function App() {
  const [pantry, setPantry] = useState<Pantry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    supabase
      .from('pantry')
      .select('*')
      .then((response) => setPantry(response.data as Pantry[]))
      .then(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="max-w-[800px] mx-auto flex flex-col h-full items-start justify-center">
        <header className="flex flex-col w-full sm:p-5 p-10">
          <span className="text-[13px] font-medium">STATUS</span>

          <div className="flex items-center space-x-2.5">
            <label className="flex focus-within:border-zinc-800 sm:max-w-[50%] items-center space-x-1.5 my-10 border border-zinc-200 w-full p-1 rounded-full">
              <button className="bg-zinc-900 h-12 w-32 space-x-1.5 flex items-center justify-center rounded-full -tracking-wide">
                <ChevronDown className="h-4 w-4 text-zinc-100" />
                <span className="text-xs font-medium text-zinc-100">
                  {currentDate}
                </span>
              </button>

              <input
                type="text"
                className="text-[13px] font-medium w-full h-12 rounded-r-full outline-none pl-1.5"
                placeholder="Buscar produto..."
              />
            </label>

            <CreateProduct />
          </div>

          <section className="grid grid-cols-3 sm:grid-cols-5 grid-rows-2 sm:grid-rows-1 gap-2.5 w-full">
            <div className="flex flex-col col-span-2 space-y-2 items-center justify-center rounded-2xl py-10 bg-zinc-100">
              <strong className="text-4xl -tracking-widest">0</strong>
              <span className="text-xs font-medium">PROD. VENCIDOS</span>
            </div>
            <div className="flex flex-col space-y-2 items-center justify-center rounded-2xl py-10 bg-[#DEF0FD]">
              <strong className="text-4xl -tracking-widest">
                {pantry.filter((item) => item.product_tag === 'geral').length ??
                  0}
              </strong>
              <span className="text-xs font-medium">GERAL</span>
            </div>
            <div className="flex flex-col space-y-2 items-center justify-center rounded-2xl py-10 bg-[#FCE8DC]">
              <strong className="text-4xl -tracking-widest">
                {pantry.filter((item) => item.product_tag === 'limpeza')
                  .length ?? 0}
              </strong>
              <span className="text-xs font-medium">LIMPEZA</span>
            </div>
            <div className="flex flex-col space-y-2 items-center justify-center rounded-2xl py-10 bg-[#FFFAC7]">
              <strong className="text-4xl -tracking-widest">
                {pantry.filter((item) => item.product_tag === 'alimentação')
                  .length ?? 0}
              </strong>
              <span className="text-xs font-medium">ALIMENTAÇÃO</span>
            </div>
          </section>
        </header>

        <div className="my-5 px-10 sm:px-5">
          <span className="text-[13px] font-medium">
            TODOS OS PRODUTOS DA DESPENSA
          </span>
        </div>

        <ul className="mt-5 pb-10 sm:mt-10 w-full grid gap-2.5 grid-cols-2 sm:grid-cols-4 px-10 sm:px-5">
          {loading ? (
            <>
              <li className="border border-zinc-200 rounded-2xl p-4 animate-pulse bg-zinc-100 min-h-[100px] w-full relative"></li>
              <li className="border border-zinc-200 rounded-2xl p-4 animate-pulse bg-zinc-100 min-h-[100px] w-full relative"></li>
              <li className="border border-zinc-200 rounded-2xl p-4 animate-pulse bg-zinc-100 min-h-[100px] w-full relative"></li>
            </>
          ) : (
            <>
              {pantry?.map((i) => (
                <li
                  key={i.id}
                  className="border border-zinc-200 rounded-2xl p-4 min-h-[100px] w-full relative"
                >
                  <section className="flex items-center justify-between">
                    <span className="bg-zinc-800 px-2 py-1 rounded-full text-xs font-semibold text-white -tracking-wider">
                      1 de {i.product_quantity}
                    </span>

                    <button className="flex flex-col space-y-0.5">
                      <div className="h-[2px] bg-zinc-900 w-5 rounded-full"></div>
                      <div className="h-[2px] bg-zinc-400 w-2.5 rounded-full"></div>
                    </button>
                  </section>

                  <div className="flex items-center my-2.5 space-x-2">
                    <span className="text-[15px] font-medium -tracking-wider capitalize truncate">
                      {i.product_name}
                    </span>
                  </div>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </>
  )
}
