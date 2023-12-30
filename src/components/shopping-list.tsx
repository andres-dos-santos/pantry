'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, ShoppingCart } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { supabase } from '../lib/supabase'
import { toast } from '../utils/toast'

const Schema = z.object({
  name: z.string(),
  quantity: z.number(),
  quantity_suffix: z.string().transform((val) => val.toUpperCase()),
  tag: z.string().transform((val) => val.toLowerCase()),
  expirated_at: z.string().transform((val) => {
    const [day, month, year] = val.split('/')

    const transformed = `20${year}-${month}-${day}T09:00:00+00:00`

    return transformed
  }),
})

type SchemaInput = z.infer<typeof Schema>

export function ShoppingList() {
  const [show, setShow] = useState(false)
  const [add, setAdd] = useState(false)
  const [loading, setLoading] = useState(false)

  const { handleSubmit, register, reset } = useForm<SchemaInput>({
    resolver: zodResolver(Schema),
  })

  async function onSubmit(input: SchemaInput) {
    try {
      setLoading(true)

      await supabase.from('products').insert(input)

      toast({ message: 'Criado com sucesso!', type: 'success' })

      reset()
    } catch (error) {
      toast({ message: JSON.stringify(error), type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDown = useCallback(() => {
    setShow(false)
  }, [])

  return (
    <>
      <button
        onClick={() => setShow((prev) => !prev)}
        className="rounded-tl-3xl rounded-br-3xl rounded-bl-[7px] rounded-tr-[7px] fixed bg-zinc-800 bottom-5 right-5 flex items-center justify-center border border-zinc-800 -tracking-wide text-[12px] uppercase font-medium min-h-[3.5rem] h-14 px-7 text-white"
      >
        <ShoppingCart className="w-4 h-4 mr-2.5" />
        Lista de compras
      </button>

      <aside
        data-show={show}
        className="data-[show=true]:flex data-[show=false]:invisible transition-all duration-300 data-[show=false]:top-full sm:max-w-[400px] data-[show=true]:top-0 flex-col bg-white fixed right-0 bottom-0 h-screen z-10 w-full sm:border-l border-l-zinc-200"
      >
        <header className="flex flex-col w-full p-10 sm:p-5 items-center justify-center mb-5">
          <button
            onClick={handleDown}
            className="flex items-center justify-center h-5 mb-10 w-full"
          >
            <div className="h-[2px] rounded-full w-[25%] bg-zinc-800"></div>
          </button>

          <span className="text-[13px] font-medium">LISTA DE COMPRAS</span>
        </header>

        {add ? (
          <form
            action=""
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col px-10 sm:px-5"
          >
            <input
              type="text"
              className="mb-2.5 rounded-2xl capitalize bg-zinc-100/50 h-12 w-full text-[12px] font-medium border border-zinc-200 outline-none focus:border-zinc-800 px-4 -tracking-wide placeholder:uppercase"
              placeholder="Nome com a marca"
              {...register('name')}
            />

            <section className="flex items-center space-x-2.5">
              <input
                type="text"
                className="mb-2.5 rounded-2xl bg-zinc-100/50 h-12 w-full text-[12px] font-medium border border-zinc-200 outline-none focus:border-zinc-800 px-4 -tracking-wide placeholder:uppercase"
                placeholder="Quantidade"
                {...register('quantity', { valueAsNumber: true })}
              />
              <input
                type="text"
                className="mb-2.5 uppercase rounded-2xl bg-zinc-100/50 h-12 w-full text-[12px] font-medium border border-zinc-200 outline-none focus:border-zinc-800 px-4 -tracking-wide placeholder:uppercase"
                placeholder="Sufixo"
                {...register('quantity_suffix')}
              />
            </section>

            <footer className="flex items-center space-x-2.5 mt-5">
              <button
                onClick={() => setAdd(false)}
                className="flex items-center justify-center border border-zinc-200 h-12 mb-2.5 rounded-2xl w-full"
              >
                <span className="text-[12px] font-semibold -tracking-wider text-zinc-800">
                  VOLTAR
                </span>
              </button>

              <button className="flex items-center justify-center border border-zinc-800 bg-zinc-800 h-12 mb-2.5 rounded-2xl w-full">
                <span className="text-[12px] font-semibold -tracking-wider text-white">
                  {loading ? 'CARREGANDO' : 'ADICIONAR PRODUTO'}
                </span>
              </button>
            </footer>
          </form>
        ) : (
          <ul className="px-10 sm:px-5">
            <button
              onClick={() => setAdd((prev) => !prev)}
              className="rounded-tl-3xl rounded-br-3xl rounded-bl-[7px] rounded-tr-[7px] fixed bg-zinc-800 bottom-5 right-5 flex items-center justify-center border border-zinc-800 -tracking-wide text-[12px] uppercase font-medium min-h-[3.5rem] h-14 px-7 text-white"
            >
              <Plus className="w-4 h-4 mr-2.5" />
              Adicionar
            </button>

            <li className="flex items-center justify-between mb-5">
              <span className="font-medium capitalize text-xl -tracking-wider">
                Arroz Palmares
              </span>
              <span className="font-medium capitalize text-xl -tracking-wider">
                3 PC
              </span>
            </li>

            <li className="flex items-center justify-between mb-5">
              <span className="font-medium capitalize text-xl -tracking-wider">
                Feijão Carioca
              </span>
              <span className="font-medium capitalize text-xl -tracking-wider">
                4 PC
              </span>
            </li>
          </ul>
        )}
      </aside>
    </>
  )
}
