import { useCallback, useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'

import { supabase } from './lib/supabase'

import { CreateProduct } from './components/create-product'
import { DatePicker } from './components/date-picker'
import { UpdateProduct } from './components/update-product'
import { ShoppingList } from './components/shopping-list'

import 'dayjs/locale/pt-br'

interface Product {
  id: number
  created_at: string
  name: string
  quantity: number
  usage_quantity: number
  quantity_suffix: string
  tag: string
  price: number
  updated_at: string
  expirated_at: string
}

export default function App() {
  const [pantry, setPantry] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)

  const handleDown = useCallback(() => {
    setProduct(null)
  }, [])

  useEffect(() => {
    setLoading(true)
    supabase
      .from('products')
      .select('*')
      .then((response) => setPantry(response.data as Product[]))
      .then(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="max-w-[800px] mx-auto flex flex-col h-full items-start justify-center">
        <div className="flex items-center space-x-2.5 px-10 sm:px-5 mt-10">
          <label className="flex focus-within:border-zinc-800 sm:max-w-[100%] items-center space-x-1.5 border border-zinc-200 w-full p-1 rounded-full">
            <DatePicker />

            <input
              type="text"
              className="text-[13px] font-medium w-full h-12 rounded-r-full outline-none pl-1.5"
              placeholder="Buscar produto..."
            />
          </label>

          <CreateProduct />
          {product ? (
            <UpdateProduct product={product} down={handleDown} />
          ) : null}
        </div>

        <span className="flex my-10 px-10 sm:px-5 text-[13px] font-medium">
          STATUS
        </span>

        <section className="px-10 sm:px-5 grid grid-cols-3 sm:grid-cols-5 grid-rows-2 sm:grid-rows-1 gap-2.5 w-full">
          <div className="flex flex-col col-span-2 space-y-2 items-center justify-center rounded-2xl py-10 bg-zinc-100">
            <strong className="text-4xl -tracking-widest">0</strong>
            <span className="text-xs font-medium">PROD. VENCIDOS</span>
          </div>
          <div className="flex flex-col space-y-2 items-center justify-center rounded-2xl py-10 bg-[#DEF0FD]">
            <strong className="text-4xl -tracking-widest">
              {pantry.filter((item) => item.tag === 'outros').length ?? 0}
            </strong>
            <span className="text-xs font-medium">OUTROS</span>
          </div>
          <div className="flex flex-col space-y-2 items-center justify-center rounded-2xl py-10 bg-[#FCE8DC]">
            <strong className="text-4xl -tracking-widest">
              {pantry.filter((item) => item.tag === 'limpeza').length ?? 0}
            </strong>
            <span className="text-xs font-medium">LIMPEZA</span>
          </div>
          <div className="flex flex-col space-y-2 items-center justify-center rounded-2xl py-10 bg-[#FFFAC7]">
            <strong className="text-4xl -tracking-widest">
              {pantry.filter((item) => item.tag === 'alimentação').length ?? 0}
            </strong>
            <span className="text-xs font-medium">ALIMENTAÇÃO</span>
          </div>
        </section>

        <span className="flex my-10 px-10 sm:px-5 text-[13px] font-medium">
          TODOS OS PRODUTOS DA DESPENSA
        </span>

        <ul className="w-full grid gap-2.5 grid-cols-2 sm:grid-cols-4 px-10 sm:px-5 pb-40">
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
                  className="group hover:border-zinc-800 cursor-pointer border border-zinc-200 rounded-2xl p-4 min-h-[100px] w-full relative"
                  onClick={() => setProduct(i)}
                >
                  <section className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="bg-zinc-800 px-2 py-1 rounded-full text-xs font-semibold text-white -tracking-wider">
                        {i.usage_quantity} de {i.quantity}
                      </span>
                      <span className="border border-zinc-200 px-2.5 py-1 rounded-full text-[11px] font-semibold -tracking-wider">
                        {i.quantity_suffix}
                      </span>
                    </div>

                    <ArrowRight className="group-hover:translate-x-2 transition-all duration-300 w-4 h-4" />
                  </section>

                  <div className="flex items-center my-2.5 space-x-2">
                    <span className="text-[15px] font-medium -tracking-wider capitalize truncate">
                      {i.name}
                    </span>
                  </div>
                </li>
              ))}
            </>
          )}
        </ul>

        <ShoppingList />
      </div>
    </>
  )
}
