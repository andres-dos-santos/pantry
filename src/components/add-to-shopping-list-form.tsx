/* eslint-disable camelcase */
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { supabase } from '../lib/supabase'

import { toast } from '../utils/toast'

import { Input } from './ui/input'

const Schema = z.object({
  name: z.string(),
  quantity: z.number(),
  quantity_suffix: z.string().transform((val) => val.toUpperCase()),
})

type SchemaInput = z.infer<typeof Schema>

interface Props {
  product?: {
    name: string
    quantity: number
    quantity_suffix: string
  }
  back(): void
}

export function AddToShoppingListForm({ product, back }: Props) {
  const [loading, setLoading] = useState(false)

  const { handleSubmit, register, reset, setValue, watch } =
    useForm<SchemaInput>({
      resolver: zodResolver(Schema),
      defaultValues: product,
    })

  function onSubmit(input: SchemaInput) {
    try {
      setLoading(true)

      supabase
        .from('shopping-list')
        .insert({
          ...input,
          quantity_suffix: watch('quantity_suffix'),
        })
        .then(() => {
          toast({ message: 'Produto adicionado com sucesso!', type: 'success' })
        })
    } catch (error) {
      toast({ message: JSON.stringify(error), type: 'error' })
    } finally {
      setLoading(false)

      reset()

      back()
    }
  }

  /** useEffect(() => {
    product && reset(product)
  }, [product, reset]) */

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

      <footer className="fixed bottom-10 left-10 right-10 flex items-center justify-center space-x-2.5">
        <button className="flex items-center justify-center w-full border border-zinc-800 bg-zinc-800 h-10 rounded-[5px]">
          <span className="text-[12px] font-semibold -tracking-wider text-white">
            {loading ? 'CARREGANDO' : 'ADICIONAR A LISTA DE COMPRAS'}
          </span>
        </button>
      </footer>
    </form>
  )
}
