'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import MaskedInput from 'react-text-mask'
import { supabase } from '../lib/supabase'

const Schema = z.object({
  product_name: z.string(),
  product_quantity: z.number(),
  product_suffix: z.string(),
  product_tag: z.string(),
  /** product_price: z.string().transform((val) => {
    return Number(val.replace(',', ''))
  }), */
  expiration_date: z.string().transform((val) => {
    const [day, month, year] = val.split('/')

    const transformed = `20${year}-${month}-${day}T09:00:00+00:00`

    return transformed
  }),
})

type SchemaInput = z.infer<typeof Schema>

export function CreateProduct() {
  const [show, setShow] = useState(false)

  const { handleSubmit, register, control, reset } = useForm<SchemaInput>({
    resolver: zodResolver(Schema),
  })

  const [loading, setLoading] = useState(false)

  async function onSubmit(input: SchemaInput) {
    try {
      setLoading(true)

      await supabase
        .from('pantry')
        .insert([{ ...input }])
        .select()

      reset()
    } catch (error) {
      alert(JSON.stringify(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={() => setShow((prev) => !prev)}>
        <Plus className="w-5 h-5" />
      </button>

      <aside
        data-show={show}
        className="data-[show=true]:flex data-[show=false]:hidden flex-col bg-white fixed right-0 top-0 bottom-0 sm:w-96 w-full sm:border-l border-l-zinc-200"
      >
        <header className="flex items-center justify-between w-full p-5 border-b border-b-zinc-200">
          <strong className="text-[15px] sm:text-[24px] font-medium uppercase -tracking-wide">
            Adicione um produto a despensa
          </strong>

          <button onClick={() => setShow((prev) => !prev)}>
            <X className="w-5 h-5" />
          </button>
        </header>

        <form
          action=""
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2.5 p-5"
        >
          <input
            type="text"
            className="bg-zinc-100/50 h-8 w-full text-[12px] font-medium uppercase border border-zinc-200 outline-none focus:border-zinc-800 px-2 -tracking-wide"
            placeholder="Nome com a marca"
            {...register('product_name')}
          />

          <section className="flex items-center space-x-2.5">
            <input
              type="text"
              className="bg-zinc-100/50 h-8 w-full text-[12px] font-medium uppercase border border-zinc-200 outline-none focus:border-zinc-800 px-2 -tracking-wide"
              placeholder="Quantidade"
              {...register('product_quantity', { valueAsNumber: true })}
            />
            <input
              type="text"
              className="bg-zinc-100/50 h-8 w-full text-[12px] font-medium uppercase border border-zinc-200 outline-none focus:border-zinc-800 px-2 -tracking-wide"
              placeholder="Sufixo"
              {...register('product_suffix')}
            />
          </section>

          <input
            type="text"
            className="bg-zinc-100/50 h-8 w-full text-[12px] font-medium uppercase border border-zinc-200 outline-none focus:border-zinc-800 px-2 -tracking-wide"
            placeholder="Tag"
            {...register('product_tag')}
          />

          {/** <div className="bg-zinc-100/50 h-8 w-full flex items-center px-2 text-[12px] font-medium uppercase border border-zinc-200 focus-within:border-zinc-800">
            <span className="font-semibold">R$</span>
            <input
              className="h-6 w-full mb-0.5 ml-1 outline-none -tracking-wide"
              placeholder="Preço"
              {...register('product_price')}
            />
          </div> */}

          <Controller
            control={control}
            name="expiration_date"
            render={({ field }) => (
              <MaskedInput
                className="bg-zinc-100/50 h-8 w-full text-[12px] font-medium uppercase border border-zinc-200 outline-none focus:border-zinc-800 px-2 -tracking-wide"
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

          <button className="flex items-center justify-center border border-zinc-800 bg-zinc-800 h-8 mt-10 w-full">
            <span className="text-[12px] font-semibold -tracking-wider text-white">
              {loading ? 'CARREGANDO' : 'ADICIONAR PRODUTO'}
            </span>
          </button>
        </form>
      </aside>
    </>
  )
}
