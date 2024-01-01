import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface Props {
  quantity: number
  onUpdate(value: number): void
}

const Schema = z.object({
  quantity: z.string(),
})

type SchemaInput = z.input<typeof Schema>

export function QuantityForm({ quantity, onUpdate }: Props) {
  const { register, handleSubmit } = useForm<SchemaInput>({
    resolver: zodResolver(Schema),
  })

  function onSubmit(input: SchemaInput) {
    onUpdate(Number(input.quantity))
  }

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        className="max-w-[30px] text-end mr-1 focus:outline-none text-[14px] font-medium"
        defaultValue={quantity}
        {...register('quantity')}
      />
      <button type="submit" className="invisible"></button>
    </form>
  )
}
