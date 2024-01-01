import { z } from 'zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import MaskedInput from 'react-text-mask'
import dayjs from 'dayjs'

import { Input } from './ui/input'

import { toast } from '../utils/toast'

import { supabase } from '../lib/supabase'

import type { Product } from '../types'

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

interface Props {
  product?: Product
  onRemove?(): void
}

export function ProductForm({ product, onRemove }: Props) {
  const [loading, setLoading] = useState(false)

  const { handleSubmit, register, control, reset, setValue, watch } =
    useForm<SchemaInput>({
      resolver: zodResolver(Schema),
    })

  function create(input: SchemaInput) {
    supabase
      .from('products')
      .insert({
        ...input,
        tag: watch('tag'),
        quantity_suffix: watch('quantity_suffix'),
      })
      .then(() => {
        toast({ message: 'Criado com sucesso!', type: 'success' })
      })
  }

  function update(input: SchemaInput) {
    supabase
      .from('products')
      .update(input)
      .eq('id', product!.id)
      .then(() => {
        toast({ message: 'Atualizado com sucesso!', type: 'success' })
      })
  }

  function onSubmit(input: SchemaInput) {
    try {
      setLoading(true)

      product ? update(input) : create(input)
    } catch (error) {
      toast({ message: 'Ocorreu um erro!', type: 'error' })
    } finally {
      setLoading(false)

      reset()
    }
  }

  useEffect(() => {
    product && reset(product)
  }, [product, reset])

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <Input.Root>
        <Input.Label>NOME E MARCA</Input.Label>
        <Input.Write
          placeholder="Banana Prata Boa Vida"
          {...register('name')}
        />
      </Input.Root>

      <div className="flex items-baseline space-x-5 w-full">
        <Input.Root className="max-w-[25%] w-[25%] min-w-[25%]">
          <Input.Label>QUANTIDADE</Input.Label>
          <Input.Write
            type="number"
            className="input"
            placeholder="00"
            {...register('quantity', { valueAsNumber: true })}
          />
        </Input.Root>

        <Input.Root>
          <Input.Label>SUFIXO</Input.Label>
          <div className="flex items-center space-x-1.5">
            {['KG', 'GR', 'PC', 'UN', 'LT'].map((i) => (
              <button
                key={i}
                type="button"
                data-selected={watch('quantity_suffix') === i}
                onClick={() => setValue('quantity_suffix', i)}
                className="data-[selected=true]:ring-2 data-[selected=true]:ring-blue-200 data-[selected=true]:border-blue-500 data-[selected=true]:border border border-zinc-100 bg-zinc-100 rounded-[5px] h-10 w-10 text-[11px] font-semibold flex items-center justify-center -tracking-wide"
              >
                {i}
              </button>
            ))}
          </div>
        </Input.Root>
      </div>

      <Input.Root>
        <Input.Label>TAG</Input.Label>
        <div className="flex flex-wrap items-center space-x-1.5">
          {['alimentação', 'limpeza', 'outros'].map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => setValue('tag', i)}
              data-selected={watch('tag') === i}
              className="data-[selected=true]:ring-2 data-[selected=true]:ring-blue-200 data-[selected=true]:border-blue-500 data-[selected=true]:border border border-zinc-100 bg-zinc-100 rounded-[5px] h-10 px-4 uppercase text-[11px] font-semibold flex items-center justify-center -tracking-wide"
            >
              {i}
            </button>
          ))}
        </div>
      </Input.Root>

      <Input.Root>
        <Input.Label>DATA DE VALIDADE</Input.Label>
        <Controller
          control={control}
          name="expirated_at"
          render={({ field }) => (
            <MaskedInput
              className="rounded-[5px] capitalize bg-zinc-100/50 h-10 focus:ring-2 focus:ring-blue-200 w-full text-[13px] font-medium border border-zinc-200 outline-none focus:border-blue-500 px-2 -tracking-wide"
              placeholder={dayjs(new Date()).format('DD/MM/YY')}
              defaultValue={
                product
                  ? dayjs(product.expirated_at).format('DD/MM/YY')
                  : undefined
              }
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
      </Input.Root>

      <footer className="fixed bottom-10 left-10 right-10 flex items-center justify-center space-x-2.5">
        {product ? (
          <button
            onClick={onRemove}
            className="flex items-center w-full justify-center border border-red-500 bg-red-200/50 h-10 rounded-[5px]"
          >
            <span className="text-[12px] font-semibold -tracking-wider text-red-500">
              {loading ? 'CARREGANDO' : 'REMOVER'}
            </span>
          </button>
        ) : null}

        <button className="flex items-center justify-center w-full border border-zinc-800 bg-zinc-800 h-10 rounded-[5px]">
          <span className="text-[12px] font-semibold -tracking-wider text-white">
            {loading
              ? 'CARREGANDO'
              : product
                ? 'ATUALIZAR PRODUTO'
                : 'ADICIONAR PRODUTO'}
          </span>
        </button>
      </footer>
    </form>
  )
}
