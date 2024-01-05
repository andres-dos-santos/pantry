import { useNavigate } from 'react-router-dom'

import { useMutate } from '../hooks/use-mutation'

import { supabase } from '../lib/supabase'

import { toast } from '../utils/toast'

interface Props {
  productId: string
}

export function RemoveProduct({ productId }: Props) {
  const { isIdle, mutate } = useMutate(remove, ['get-products-query'])

  const navigate = useNavigate()

  async function remove(productId: string) {
    try {
      await supabase.from('products').delete().eq('id', productId)

      toast({ message: 'Removido com sucesso', type: 'error' })

      navigate('/')
    } catch (error) {
      toast({ message: 'Algo deu errado!', type: 'error' })
    }
  }

  return (
    <button
      onClick={() => mutate(productId)}
      className="flex items-center justify-center w-full sm:w-[30%] border border-red-500 bg-red-500 h-10 rounded-[5px]"
    >
      <span className="text-[12px] font-semibold -tracking-wider text-white">
        {!isIdle ? 'CARREGANDO' : 'REMOVER ESSE PRODUTO'}
      </span>
    </button>
  )
}
