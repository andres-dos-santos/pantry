import { ArrowRight, Plus, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { supabase } from '../lib/supabase'

import type { Product } from '../types'

import 'dayjs/locale/pt-br'
import { FormEvent, useRef, useState } from 'react'
import { toast } from '../utils/toast'

export function Home() {
  async function getProducts() {
    const { data } = await supabase.from('products').select('*')

    return data as Product[]
  }

  const { data, isLoading } = useQuery({
    queryKey: ['get-products-query'],
    queryFn: getProducts,
  })

  const inputRef = useRef<HTMLInputElement>(null)

  const [searched, setSearched] = useState<Product[]>([])

  async function search(e: FormEvent) {
    e.preventDefault()

    const text = inputRef.current?.value

    if (text) {
      try {
        const { data } = await supabase
          .from('products')
          .select()
          .textSearch('name', text)

        setSearched(data as Product[])

        toast({
          message: `Encontrado ${data?.length} produtos`,
          type: 'success',
        })
      } catch (error) {
        toast({ message: 'Ocorreu algum erro', type: 'error' })
      }
    }
  }

  const products = searched.length > 0 ? searched : data || []

  function clearSearch() {
    inputRef.current!.value = ''

    setSearched([])
  }

  return (
    <>
      <div className="max-w-[800px] mx-auto flex flex-col h-full items-start justify-center">
        <section className="px-10 sm:px-5 grid grid-cols-3 sm:grid-cols-5 grid-rows-2 sm:grid-rows-1 gap-2.5 w-full mt-10">
          <div className="flex flex-col col-span-2 space-y-2 items-center justify-center rounded-[5px] py-10 bg-zinc-100">
            <strong className="text-4xl -tracking-widest">0</strong>
            <span className="text-xs font-medium">PROD. VENCIDOS</span>
          </div>
          <div className="flex flex-col space-y-2 items-center justify-center rounded-[5px] py-10 bg-[#DEF0FD]">
            <strong className="text-4xl -tracking-widest">
              {data?.filter((item) => item.tags.includes('outros')).length ?? 0}
            </strong>
            <span className="text-xs font-medium">OUTROS</span>
          </div>
          <div className="flex flex-col space-y-2 items-center justify-center rounded-[5px] py-10 bg-[#FCE8DC]">
            <strong className="text-4xl -tracking-widest">
              {data?.filter((item) => item.tags.includes('limpeza')).length ??
                0}
            </strong>
            <span className="text-xs font-medium">LIMP.</span>
          </div>
          <div className="flex flex-col space-y-2 items-center justify-center rounded-[5px] py-10 bg-[#FFFAC7]">
            <strong className="text-4xl -tracking-widest">
              {data?.filter((item) =>
                item.tags.includes('alimentação' || 'Alimentação'),
              ).length ?? 0}
            </strong>
            <span className="text-xs font-medium">ALIM.</span>
          </div>
        </section>

        <section className="flex items-center justify-between w-full my-10 px-10 sm:px-5">
          <span className="text-[13px] font-medium">DESPENSA</span>

          <div className="flex items-center space-x-2">
            {searched.length > 0 && (
              <button
                className="flex items-center space-x-1"
                onClick={clearSearch}
              >
                <X className="h-4 w-4 text-red-500" />
                <p className="text-[11px] font-semibold hover:text-zinc-600">
                  LIMPAR PESQUISA
                </p>
              </button>
            )}

            <form action="" onSubmit={search}>
              <input
                type="text"
                ref={inputRef}
                className="h-10 rounded-full border border-zinc-200 w-full text-[13px] font-medium focus:ring-2 focus:ring-blue-200 outline-none focus:border-blue-500 px-3 -tracking-wide"
                placeholder="Pesquisar por nome"
              />

              <button type="submit" className="invisible"></button>
            </form>

            <Link
              to="/new"
              className="flex items-center justify-center border border-zinc-200 -tracking-wide text-[12px] uppercase font-medium min-h-[2.5rem] h-10 min-w-[2.5rem] w-10 rounded-full"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <ul className="w-full grid gap-2.5 grid-cols-2 sm:grid-cols-4 px-10 sm:px-5 pb-40">
          {isLoading ? (
            <>
              <li className="border border-zinc-200 rounded-[5px] p-4 animate-pulse bg-zinc-100 min-h-[100px] w-full relative"></li>
              <li className="border border-zinc-200 rounded-[5px] p-4 animate-pulse bg-zinc-100 min-h-[100px] w-full relative"></li>
              <li className="border border-zinc-200 rounded-[5px] p-4 animate-pulse bg-zinc-100 min-h-[100px] w-full relative"></li>
            </>
          ) : (
            <>
              {products.map((i) => (
                <li
                  key={i.id}
                  className="group hover:border-zinc-800 cursor-pointer border border-zinc-200 rounded-[5px] p-4 min-h-[100px] w-full relative"
                >
                  <Link to={`/${i.id}`}>
                    <div className="flex items-center mb-5 space-x-2">
                      <span className="text-[15px] font-medium -tracking-wider capitalize truncate">
                        {i.name}
                      </span>
                    </div>

                    <section className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <span
                          data-completed={i.usage === i.quantity}
                          className="data-[completed=true]:bg-red-500 data-[completed=true]:border-red-500 data-[completed=true]:text-white flex items-center justify-center border border-zinc-200 h-6 px-3 lowercase rounded-full text-[11px] font-semibold -tracking-wider"
                        >
                          {i.usage} de {i.quantity}
                        </span>

                        <span className="border border-zinc-200 flex items-center justify-center h-6 px-3 rounded-full text-[11px] font-semibold -tracking-wider">
                          {i.suffix}
                        </span>
                      </div>

                      <ArrowRight className="group-hover:translate-x-2 transition-all duration-300 w-4 h-4" />
                    </section>
                  </Link>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </>
  )
}
