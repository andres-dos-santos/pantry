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
  name: string
  quantity: number
  quantity_suffix: string

  back(): void
}

export function AddToShoppingListForm({
  name,
  quantity,
  quantity_suffix,

  back,
}: Props) {
  const [loading, setLoading] = useState(false)

  const { handleSubmit, register, reset, setValue, watch } =
    useForm<SchemaInput>({
      resolver: zodResolver(Schema),
      defaultValues: {
        name,
        quantity,
        quantity_suffix,
      },
    })

  async function onSubmit(input: SchemaInput) {
    try {
      setLoading(true)

      await supabase.from('shopping-list').insert({
        ...input,
        quantity_suffix: watch('quantity_suffix'),
      })

      toast({ message: 'Criado com sucesso!', type: 'success' })

      reset()

      back()
    } catch (error) {
      toast({ message: JSON.stringify(error), type: 'error' })
    } finally {
      setLoading(false)
    }
  }
  return (
    <form action="" onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <Input.Root>
        <Input.Label>NOME E MARCA</Input.Label>
        <Input.Write placeholder="Nome com a marca" {...register('name')} />
      </Input.Root>

      <Input.Root>
        <Input.Label>QUANTIDADE</Input.Label>
        <Input.Write
          type="number"
          placeholder="Quantidade"
          {...register('quantity', { valueAsNumber: true })}
        />
      </Input.Root>

      <Input.Root>
        <Input.Label>SUFIXO</Input.Label>
        <div className="flex flex-wrap items-center space-x-2">
          {['KG', 'GR', 'PC', 'UN', 'LT'].map((i) => (
            <button
              key={i}
              data-selected={watch('quantity_suffix') === i}
              onClick={() => setValue('quantity_suffix', i)}
              className="data-[selected=true]:bg-zinc-900 data-[selected=true]:text-white bg-zinc-100 rounded-xl h-10 w-10 text-xs font-medium flex items-center justify-center -tracking-wide"
            >
              {i}
            </button>
          ))}
        </div>
      </Input.Root>

      <footer className="mt-5 flex items-center justify-center space-x-2.5">
        <button
          type="button"
          className="flex items-center justify-center border border-zinc-200 h-12 mb-2.5 rounded-2xl w-full"
          onClick={back}
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
            {loading ? 'CARREGANDO' : 'PARA A LISTA'}
          </span>
        </button>
      </footer>
    </form>
  )
}
