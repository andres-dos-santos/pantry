'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus, Trash } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import MaskedInput from 'react-text-mask'
import dayjs from 'dayjs'

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

interface Props {
  product: Product
  down(): void
}

export function UpdateProduct({ product, down }: Props) {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [update, setUpdate] = useState(false)

  const { handleSubmit, register, control, reset } = useForm<SchemaInput>({
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

    down()

    setUpdate(false)
  }, [down])

  async function updateUsage() {
    try {
      await supabase
        .from('products')
        .update({ usage_quantity: product.usage_quantity + 1 })
        .eq('id', product.id)

      toast({ message: 'Atualizado com sucesso!', type: 'success' })

      handleDown()
    } catch (error) {
      toast({ message: 'Ocorreu um erro!', type: 'error' })
    }
  }

  async function handleRemove() {
    try {
      await supabase
        .from('products')
        .delete()
        .eq('id', product?.id)

      toast({ message: 'Removido com sucesso!', type: 'success' })

      handleDown()
    } catch (error) {
      toast({ message: 'Ocorreu um erro', type: 'error' })
    }
  }

  useEffect(() => {
    if (product) {
      setShow(true)

      reset({
        ...product,
        expirated_at: dayjs(product.expirated_at).format('DD/MM/YY'),
      })
    } else {
      setUpdate(true)
    }
  }, [product, reset])

  return (
    <>
      <aside
        data-show={show}
        className="data-[show=true]:flex data-[show=false]:invisible transition-all duration-300 data-[show=false]:top-full sm:max-w-[600px] data-[show=true]:top-0 flex-col bg-white fixed right-0 bottom-0 h-screen z-10 w-full sm:border-l border-l-zinc-200"
      >
        <header className="flex flex-col w-full p-10 sm:p-5 items-center justify-center mb-5">
          <button
            onClick={handleDown}
            className="flex items-center justify-center h-5 mb-10 w-full"
          >
            <div className="h-[2px] rounded-full w-[25%] bg-zinc-800"></div>
          </button>

          <span className="text-[13px] font-medium">DETALHES</span>
        </header>

        {update ? (
          <form
            action=""
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col px-10 sm:px-14"
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

            <input
              type="text"
              className="mb-2.5 lowercase rounded-2xl bg-zinc-100/50 h-12 w-full text-[12px] font-medium border border-zinc-200 outline-none focus:border-zinc-800 px-4 -tracking-wide placeholder:uppercase"
              placeholder="Tag"
              {...register('tag')}
            />

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

            <footer className="flex items-center space-x-2.5 mt-5">
              <button
                type="button"
                onClick={() => setUpdate((prev) => !prev)}
                className="flex items-center justify-center border border-zinc-800 h-12 mb-2.5 rounded-2xl w-full"
              >
                <span className="text-[12px] font-semibold -tracking-wider text-zinc-800">
                  VOLTAR
                </span>
              </button>
              <button
                type="submit"
                className="flex items-center justify-center border border-zinc-800 bg-zinc-800 h-12 mb-2.5 rounded-2xl w-full"
              >
                <span className="text-[12px] font-semibold -tracking-wider text-white">
                  {loading ? 'CARREGANDO' : 'ATUALIZAR PRODUTO'}
                </span>
              </button>
            </footer>
          </form>
        ) : (
          <div className="px-10 sm:px-14">
            <div className="flex items-center mb-10 space-x-2">
              {product.usage_quantity < product.quantity ? (
                <button
                  onClick={updateUsage}
                  className="disabled:cursor-not-allowed flex items-center justify-center border border-zinc-200 -tracking-wide text-[12px] uppercase font-medium min-h-[3.5rem] h-14 px-7 rounded-full"
                >
                  Usar {product.usage_quantity + 1} de {product.quantity}
                </button>
              ) : null}

              <button
                onClick={() => setUpdate((prev) => !prev)}
                className="flex items-center justify-center border border-zinc-200 -tracking-wide text-[12px] uppercase font-medium min-h-[3.5rem] h-14 min-w-[3.5rem] w-14 rounded-full"
              >
                <Pencil className="w-5 h-5" />
              </button>

              <button
                onClick={handleRemove}
                className="flex items-center justify-center bg-red-100/50 border border-red-500 -tracking-wide text-[12px] uppercase font-medium min-h-[3.5rem] h-14 min-w-[3.5rem] w-14 rounded-full"
              >
                <Trash className="w-5 h-5 text-red-500" />
              </button>
            </div>

            {product.usage_quantity === product.quantity ? (
              <button
                onClick={updateUsage}
                className="flex items-center text-left justify-center bg-yellow-100/50 p-7 rounded-2xl my-10"
              >
                <Plus className="w-8 h-8 mr-5" />
                <span className="-tracking-wide text-[12px] uppercase font-medium">
                  Esse produto está em falta, clique aqui para adicionar a lista
                  de compras
                </span>
              </button>
            ) : null}

            <div className="flex flex-col space-y-5">
              <span className="font-medium capitalize text-xl -tracking-wider">
                {product.name}
              </span>

              <span className="font-medium text-xl -tracking-wider">
                {product.quantity} {product.quantity_suffix} e usando{' '}
                {product.usage_quantity} {product.quantity_suffix}
              </span>

              <span className="font-medium capitalize text-xl -tracking-wider">
                {product.tag}
              </span>

              <span className="font-medium text-xl -tracking-wider">
                vence em {dayjs(product.expirated_at).diff(new Date(), 'days')}{' '}
                dias
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
