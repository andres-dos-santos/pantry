/* eslint-disable camelcase */
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import * as RadioGroup from '@radix-ui/react-radio-group'
import dayjs from 'dayjs'

import { supabase } from '../lib/supabase'

import { toast } from '../utils/toast'

import { useMutate } from '../hooks/use-mutation'

import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'

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

interface Props {
  product?: {
    name: string
    quantity: number
    quantity_suffix: string
  }
  back(): void
}

export function AddToShoppingListForm({ product, back }: Props) {
  const { handleSubmit, register, reset, setValue, watch } =
    useForm<SchemaInput>({
      resolver: zodResolver(Schema),
      defaultValues: product,
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
        user_id: '8fd32dca-9f88-4fe4-82fb-b0a5d50e12c8',
      })

      toast({ message: 'Produto adicionado com sucesso!', type: 'success' })
    } catch (error) {
      toast({ message: JSON.stringify(error), type: 'error' })
    } finally {
      reset()

      back()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col pb-10">
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
          <RadioGroup.Root
            className="flex items-center space-x-1.5"
            defaultValue="UN"
          >
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
        <Checkbox.Label>Manter esse produto para outras compras</Checkbox.Label>
      </Checkbox.Root>

      <footer className="flex items-center justify-center space-x-2.5 mt-5">
        <button className="flex items-center justify-center w-full border border-zinc-800 bg-zinc-800 h-10 rounded-[5px]">
          <span className="text-[12px] font-semibold -tracking-wider text-white">
            {isIdle ? 'CARREGANDO' : 'ADICIONAR A LISTA DE COMPRAS'}
          </span>
        </button>
      </footer>
    </form>
  )
}
