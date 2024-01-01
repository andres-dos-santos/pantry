import { useState } from 'react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import MaskedInput from 'react-text-mask'
import dayjs from 'dayjs'

import { Input } from '../../../components/ui/input'

const Schema = z.object({
  price: z.string(),
  delivery_forecast: z.string().transform((val) => {
    const [day, month, year] = val.split('/')

    const transformed = `20${year}-${month}-${day}T09:00:00+00:00`

    return transformed
  }),
})

type SchemaInput = z.infer<typeof Schema>

export function FinishPurchase() {
  const [loading] = useState(false)
  const [finished, setFinished] = useState(false)

  const { handleSubmit, register, control } = useForm<SchemaInput>({
    resolver: zodResolver(Schema),
  })

  function onSubmit(input: SchemaInput) {
    console.log(input)
  }

  return (
    <div>
      <div>
        <form
          action=""
          data-show={finished}
          onSubmit={handleSubmit(onSubmit)}
          className="fixed left-10 right-10 bottom-10 p-5 rounded-[5px] data-[show=true]:flex hidden flex-col bg-white border border-zinc-200"
        >
          <span className="text-[13px] font-medium block mb-5 pb-5 border-b border-zinc-200">
            FINALIZE SUAS COMPRAS
          </span>

          <Input.Root>
            <Input.Label>PREÇO TOTAL</Input.Label>
            <Input.Write placeholder="R$ 50,00" {...register('price')} />
          </Input.Root>

          <Input.Root>
            <Input.Label>PREVISÃO DE ENTREGA</Input.Label>
            <Controller
              control={control}
              name="delivery_forecast"
              render={({ field }) => (
                <MaskedInput
                  className="rounded-[5px] capitalize bg-zinc-100/50 h-10 focus:ring-2 focus:ring-blue-200 w-full text-[13px] font-medium border border-zinc-200 outline-none focus:border-blue-500 px-2 -tracking-wide"
                  placeholder={dayjs(new Date()).format('DD/MM/YY')}
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

          <button
            type="submit"
            className="flex items-center justify-center w-full border border-zinc-800 bg-zinc-800 h-10 rounded-[5px]"
          >
            <span className="text-[12px] font-semibold -tracking-wider text-white">
              {loading ? 'CARREGANDO' : 'ENVIAR'}
            </span>
          </button>
        </form>
      </div>

      {!finished ? (
        <footer className="fixed bottom-10 left-10 right-10 flex items-center justify-center space-x-2.5">
          <button
            onClick={() => setFinished((prev) => !prev)}
            className="flex items-center justify-center w-full border border-zinc-800 bg-zinc-800 h-10 rounded-[5px]"
          >
            <span className="text-[12px] font-semibold -tracking-wider text-white">
              TERMINEI DE FAZER AS COMPRAS
            </span>
          </button>
        </footer>
      ) : null}
    </div>
  )
}
