/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { ArrowLeft } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import * as RadioGroup from '@radix-ui/react-radio-group'
import dayjs from 'dayjs'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as Slider from '@radix-ui/react-slider'

import { supabase } from '../lib/supabase'

import { toast } from '../utils/toast'

import { useMutate } from '../hooks/use-mutation'

import { Input } from '../components/ui/input'
import { Checkbox } from '../components/ui/checkbox'
import { Product } from '../types'
import { useState } from 'react'

const Schema = z.object({
  name: z
    .string({ required_error: 'é obrigatório.' })
    .max(120, 'Deve ter no máximo 120 caracteres.'),
  brand: z.string().max(120, 'Deve ter no máximo 120 caracteres.'),
  link: z
    .string()
    .nullable()
    .transform((value, ctx) => {
      if (value) {
        const url = z.string().url()

        try {
          const valid_url = url.parse(`https://${value}`)

          return valid_url
        } catch (error) {
          return ctx.addIssue({
            code: 'invalid_literal',
            message: 'Essa URL é inválida',
            expected: 'url',
            received: 'string',
          })
        }
      }
    }),
  quantity: z
    .number({ required_error: 'é obrigatória.' })
    .int()
    .nonnegative()
    .transform((value) => (value === 0 ? 1 : value)),
  suffix: z.enum(['KG', 'GR', 'PC', 'UN', 'LT'], {
    required_error: 'é obrigatório.',
  }),
  tags: z.string().transform((value) => {
    return value.split(',')
  }),
  price: z
    .string()
    .nullable()
    .transform((value) => {
      if (value) {
        return Number(value.replace(',', ''))
      }
    }),
  expirated_at: z
    .string()
    .nullable()
    .transform((value, ctx) => {
      if (value) {
        const [day, month, year] = value.split('/')

        if (+day > 31) {
          ctx.addIssue({
            code: 'invalid_date',
            message: 'O dia está inválido',
          })

          return ''
        }

        if (+month > 12) {
          ctx.addIssue({
            code: 'invalid_date',
            message: 'O mês está inválido',
          })

          return ''
        }

        if (dayjs(`20${year}-${month}-${day}T09:00:00+00:00`).isBefore()) {
          ctx.addIssue({
            code: 'invalid_date',
            message: 'Esse ano já passou',
          })

          return ''
        }

        const date = `20${year}-${month}-${day}T09:00:00+00:00`

        return date
      }
    }),
  fixed: z.boolean().default(false),
})

type SchemaInput = z.infer<typeof Schema>

export function CreateAndUpdate() {
  const params = useParams() as { id: 'new' | string }

  const isUpdated = params.id !== 'new'

  const { handleSubmit, register, reset, setValue, watch } =
    useForm<SchemaInput>({
      resolver: zodResolver(Schema),
    })

  const { mutate, isIdle } = useMutate<SchemaInput, void>(addProduct, [
    'get-products-query',
  ])

  function onSubmit(input: SchemaInput) {
    mutate(input)
  }

  async function addProduct(input: SchemaInput) {
    try {
      await supabase.from('products').insert({
        ...input,
        usage: 0,
        user_id: '8fd32dca-9f88-4fe4-82fb-b0a5d50e12c8',
      })

      toast({ message: 'Produto adicionado com sucesso!', type: 'success' })
    } catch (error) {
      toast({ message: JSON.stringify(error), type: 'error' })
    } finally {
      reset()

      // back()
    }
  }

  const [values, setValues] = useState<{
    usage: number
    quantity: number
  } | null>({ usage: 0, quantity: 0 })

  async function getProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)

    const input = data ? (data[0] as Product) : null

    reset(
      input
        ? {
            ...input,
            link: input.link.replace('https://', ''),
            price: String(input.price / 100).replace('.', ',') as any,
          }
        : undefined,
    )

    setValues(input ? { quantity: input.quantity, usage: input.usage } : null)
  }

  const { isLoading } = useQuery({
    queryKey: ['get-products-query'],
    queryFn: getProducts,
    enabled: isUpdated,
  })

  function handleUpdateUsage(usage: number) {
    try {
      if (isUpdated) {
        supabase
          .from('products')
          .update({ usage })
          .eq('id', params.id)
          .then(() => {
            toast({ message: 'Atualizado com sucesso!', type: 'success' })
          })
      }
    } catch (error) {
      toast({ message: 'Ocorreu um erro!', type: 'error' })
    }
  }

  return !isLoading ? (
    <>
      <aside className="overflow-y-visible flex flex-col">
        <header className="flex items-center justify-between px-10 sm:px-5 my-10">
          <Link
            to="/"
            className="flex items-center justify-center border border-zinc-200 -tracking-wide text-[12px] uppercase font-medium min-h-[2.5rem] h-10 min-w-[2.5rem] w-10 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <span className="text-[13px] font-medium">
            {isUpdated
              ? 'ATUALIZE ESSE PRODUTO NA SUA DESPENSA'
              : 'ADICIONE UM PRODUTO A SUA DESPENSA'}
          </span>
        </header>

        {isUpdated ? (
          <div className="p-10 border border-zinc-200 rounded-[5px] mb-5 mx-10 sm:mx-5">
            <span className="text-xs mb-5 block -tracking-wide font-bold">
              CONTROLE DE USO{' '}
            </span>

            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              defaultValue={[values?.usage || 0]}
              max={watch('quantity')}
              onValueCommit={(rate) => handleUpdateUsage(rate[0])}
              step={1}
              disabled={values?.usage === values?.quantity}
            >
              <Slider.Track className="bg-zinc-200 relative grow rounded-full h-[4px]">
                <Slider.Range className="absolute bg-zinc-200 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-blue-500 border border-blue-800 rounded-[10px] focus:outline-none" />
            </Slider.Root>

            <strong className="text-xs font-medium text-zinc-700 mt-5 block">
              Você está usando {values?.usage} de {values?.quantity}{' '}
              {watch('suffix')}
            </strong>
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col pb-10 sm:px-5 px-10"
        >
          <Input.Root>
            <Input.Label required>Nome</Input.Label>
            <Input.Write placeholder="Banana" {...register('name')} />
          </Input.Root>

          <div className="flex items-baseline space-x-5 w-full">
            <Input.Root className="max-w-[25%] w-[25%] min-w-[25%]">
              <Input.Label required>Quantidade</Input.Label>
              <Input.Write
                type="number"
                placeholder="00"
                {...register('quantity', { valueAsNumber: true })}
              />
            </Input.Root>

            <Input.Root>
              <Input.Label required>Sufixo</Input.Label>
              <RadioGroup.Root className="flex items-center space-x-1.5">
                {['KG', 'GR', 'PC', 'UN', 'LT'].map((i) => (
                  <div key={i} className="relative flex items-center">
                    <RadioGroup.Item
                      className="data-[state=checked]:ring-2 data-[state=checked]:ring-blue-200 data-[state=checked]:border-blue-500 border border-zinc-100 bg-zinc-100 rounded-[5px] h-10 w-10 text-[11px] font-semibold flex items-center justify-center -tracking-wide"
                      value={i}
                      id={i}
                      {...register('suffix')}
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-violet11" />
                    </RadioGroup.Item>
                    <label
                      className="text-[13px] font-medium absolute left-1/2 top-1/2 mr-[50%] -translate-x-[50%] -translate-y-[50%] leading-none"
                      htmlFor={i}
                    >
                      {i}
                    </label>
                  </div>
                ))}
              </RadioGroup.Root>
            </Input.Root>
          </div>

          <Input.Root>
            <Input.Label>Data de validade</Input.Label>

            <Input.Mask
              placeholder={dayjs(new Date()).format('DD/MM/YY')}
              mask="99/99/99"
              value={watch('expirated_at')}
              {...register('expirated_at')}
            />
          </Input.Root>

          <Input.Root>
            <Input.Label>Marca</Input.Label>
            <Input.Write placeholder="Boa Vida" {...register('brand')} />
          </Input.Root>

          <Input.Root>
            <Input.Label>Tags</Input.Label>
            <Input.Write
              type="text"
              className="input lowercase"
              placeholder="Alimentação, Carne, Boi"
              {...register('tags')}
            />
          </Input.Root>

          <Input.Root>
            <Input.Label>Link de compra</Input.Label>
            <div className="input px-2 flex items-center focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-500">
              <span className="mt-0.5">https://</span>
              <Input.Write
                type="text"
                className="w-full h-9 bg-inherit focus:outline-none"
                placeholder="meumercado.com"
                {...register('link')}
              />
            </div>
          </Input.Root>

          <Input.Root>
            <Input.Label>Preço unitário</Input.Label>
            <div className="input px-2 flex items-center focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-500">
              <span className="mt-0.5">R$ </span>
              <Input.Write
                type="text"
                className="w-full h-9 bg-inherit px-2 focus:outline-none"
                placeholder="50,00"
                {...register('price')}
              />
            </div>
          </Input.Root>

          <Checkbox.Root onCheckedChange={(value) => setValue('fixed', value)}>
            <Checkbox.Label>
              Manter esse produto para outras compras
            </Checkbox.Label>
          </Checkbox.Root>

          <footer className="flex items-center justify-center space-x-2.5 mt-5">
            <button className="flex items-center justify-center w-full border border-zinc-800 bg-zinc-800 h-10 rounded-[5px]">
              <span className="text-[12px] font-semibold -tracking-wider text-white">
                {!isIdle ? 'CARREGANDO' : 'ADICIONAR A LISTA DE COMPRAS'}
              </span>
            </button>
          </footer>
        </form>
      </aside>
    </>
  ) : null
}
