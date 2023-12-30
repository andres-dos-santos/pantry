'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import MaskedInput from 'react-text-mask'

import { supabase } from '../lib/supabase'
import { toast } from '../utils/toast'
import { Input } from './ui/input'

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

export function CreateProduct() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const { handleSubmit, register, control, reset, setValue, watch } =
    useForm<SchemaInput>({
      resolver: zodResolver(Schema),
    })

  async function onSubmit(input: SchemaInput) {
    try {
      setLoading(true)

      await supabase.from('products').insert({
        ...input,
        tag: watch('tag'),
        quantity_suffix: watch('quantity_suffix'),
      })

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

          <Input.Root>
            <Input.Label>TAG</Input.Label>
            <div className="flex flex-wrap items-center space-x-2">
              {['alimentação', 'limpeza', 'outros'].map((i) => (
                <button
                  key={i}
                  onClick={() => setValue('tag', i)}
                  data-selected={watch('tag') === i}
                  className="data-[selected=true]:bg-zinc-900 data-[selected=true]:text-white bg-zinc-100 rounded-xl h-10 px-4 uppercase text-xs font-medium flex items-center justify-center -tracking-wide"
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
          </Input.Root>

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
