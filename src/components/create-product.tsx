'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import MaskedInput from 'react-text-mask'

import { supabase } from '../lib/supabase'
import { toast } from '../utils/toast'

const Schema = z.object({
  name: z.string(),
  quantity: z.number(),
  quantity_suffix: z.string(),
  tag: z.string(),
  expirated_at: z.string().transform((val) => {
    const [day, month, year] = val.split('/')

    const transformed = `20${year}-${month}-${day}T09:00:00+00:00`

    return transformed
  }),
})

type SchemaInput = z.infer<typeof Schema>

export function CreateProduct() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const { handleSubmit, register, control, reset } = useForm<SchemaInput>({
    resolver: zodResolver(Schema),
  })

  async function onSubmit(input: SchemaInput) {
    try {
      setLoading(true)

      await supabase.from('products').insert(input).select()

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
        className="flex items-center justify-center border border-zinc-200 -tracking-wide text-[12px] uppercase font-medium min-h-[3.5rem] h-14 min-w-[3.5rem] w-14 rounded-full"
      >
        <Plus className="w-5 h-5" />
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

          <span className="text-[13px] font-medium">
            ADICIONE UM PRODUTO A SUA DESPENSA
          </span>
        </header>

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
              className="mb-2.5 rounded-2xl bg-zinc-100/50 h-12 w-full text-[12px] font-medium border border-zinc-200 outline-none focus:border-zinc-800 px-4 -tracking-wide placeholder:uppercase"
              placeholder="Sufixo"
              {...register('quantity_suffix')}
            />
          </section>

          <input
            type="text"
            className="mb-2.5 rounded-2xl bg-zinc-100/50 h-12 w-full text-[12px] font-medium border border-zinc-200 outline-none focus:border-zinc-800 px-4 -tracking-wide placeholder:uppercase"
            placeholder="Tag"
            {...register('tag')}
          />

          {/** <divmb-2.5 rounded-2xl  className="bg-zinc-100/50 h-12 w-full flex items-center px-2 -[12px] font-medium uppercase border border-zinc-200 focus-within:borde4-zinc-800" placeholder:uppercase>
            <span className="font-semibold">R$</span>
            <input
              className="h-6 w-full mb-0.5 ml-1 outline-none -tracking-wide"
              placeholder="Preço"
              {...register('price')}
            />
          </div> */}

          <Controller
            control={control}
            name="expirated_at"
            render={({ field }) => (
              <MaskedInput
                className="mb-2.5 rounded-2xl bg-zinc-100/50 h-12 w-full text-[12px] font-medium border border-zinc-200 outline-none focus:border-zinc-800 px-4 -tracking-wide placeholder:uppercase"
                placeholder="Data de validade"
                onChange={field.onChange}
                value={field.value}
                mask={[
                  /[0-9]/,
                  /[0-9]/,
                  '/',
                  /[0-9]/,
                  /[0-9]/,
                  '/',
                  /[0-9]/,
                  /[0-9]/,
                ]}
              />
            )}
          />

          <button className="mt-5 flex items-center justify-center border border-zinc-800 bg-zinc-800 h-12 mb-2.5 rounded-2xl w-full">
            <span className="text-[12px] font-semibold -tracking-wider text-white">
              {loading ? 'CARREGANDO' : 'ADICIONAR PRODUTO'}
            </span>
          </button>
        </form>
      </aside>
    </>
  )
}
