import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { ArrowUpRight, Frown, Plus, X } from 'lucide-react'

import { supabase } from '../../lib/supabase'

import { AddToShoppingListForm } from '../../components/add-to-shopping-list-form'

import { QuantityForm } from './components/quantity-form'
import { FinishPurchase } from './components/finish-purchase'

import type { Product } from '../../types'

type ShoppingListProduct = Pick<
  Product,
  'id' | 'created_at' | 'name' | 'quantity' | 'quantity_suffix'
> & {
  isPurchased: boolean
  link: string
}

async function getShoppingList() {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', '8fd32dca-9f88-4fe4-82fb-b0a5d50e12c8')

  return data as ShoppingListProduct[]
}

export function ShoppingList() {
  const { data, isLoading } = useQuery<ShoppingListProduct[]>({
    queryKey: ['get-products-query'],
    queryFn: getShoppingList,
  })

  const [add, setAdd] = useState(false)

  const [purchased, setPurchased] = useState<ShoppingListProduct[]>([])

  function handleIncreasePurchasedProducts(prod: ShoppingListProduct) {
    setPurchased((prev) => [
      ...prev.filter((i) => i.id !== prod.id),
      {
        ...prod,
        isPurchased: true,
      },
    ])
  }

  const handleBack = useCallback(() => {
    setAdd((prev) => !prev)
  }, [])

  const handleUpdateProductQuantity = useCallback(
    (prodId: string, quantity: number) => {
      setPurchased((prev) =>
        prev.map((i) => (i.id === prodId ? { ...i, quantity } : i)),
      )
    },
    [],
  )

  useEffect(() => {
    if (data)
      setPurchased(
        data.map((i) => ({
          ...i,
          isPurchased: false,
        })),
      )
  }, [data])

  return (
    <>
      <header className="px-10 flex items-center space-x-2.5 sm:px-5 mt-5 border-b border-zinc-200 pb-5">
        <button
          onClick={() => setAdd((prev) => !prev)}
          className="flex items-center justify-center border border-zinc-200 -tracking-wide text-[12px] uppercase font-medium min-h-[2.5rem] h-10 min-w-[2.5rem] w-10 rounded-full"
        >
          {add ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
        <span className="text-[13px] font-medium">LISTA DE COMPRAS</span>
      </header>

      {add ? (
        <div className="px-10 sm:px-5 mt-10">
          <AddToShoppingListForm back={handleBack} />
        </div>
      ) : (
        <ul className="px-10 sm:px-5 mt-10">
          {isLoading ? (
            <>
              <li className="flex items-center justify-between mb-5 h-[20px] animate-pulse bg-zinc-100"></li>
              <li className="flex items-center justify-between mb-5 h-[20px] animate-pulse bg-zinc-100"></li>
              <li className="flex items-center justify-between mb-5 h-[20px] animate-pulse bg-zinc-100"></li>
            </>
          ) : null}

          {purchased ? (
            <>
              {purchased.find((prod) => !prod.isPurchased) && (
                <li className="block border-b tracking-widest border-zinc-200 pb-5 mb-5 text-zinc-500 text-[12px] font-medium">
                  FALTA COMPRAR
                </li>
              )}

              {purchased.map((i) => (
                <li
                  key={i.id}
                  data-purchased={i.isPurchased}
                  className="data-[purchased=true]:hidden flex items-center justify-between mb-5"
                >
                  <button onClick={() => handleIncreasePurchasedProducts(i)}>
                    <span className="text-[14px] font-medium uppercase -tracking-wider">
                      {i.name}
                    </span>
                  </button>

                  <div className="flex items-center w-16 space-x-2">
                    <div className="flex items-center">
                      <QuantityForm
                        quantity={i.quantity}
                        onUpdate={(value) =>
                          handleUpdateProductQuantity(i.id, value)
                        }
                      />

                      <span className="text-[14px] font-medium">
                        {i.quantity_suffix}
                      </span>
                    </div>

                    <a href={i.link} target="_blank" rel="noreferrer">
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </li>
              ))}

              {purchased.find((prod) => prod.isPurchased) && (
                <li className="block border-b tracking-widest border-zinc-200 py-5 mb-5 text-zinc-500 text-[12px] font-medium">
                  COMPRADOS
                </li>
              )}

              {purchased.map((i) => (
                <li
                  key={i.id}
                  data-purchased={i.isPurchased}
                  className="data-[purchased=true]:flex hidden items-center justify-between mb-5"
                  onClick={() =>
                    setPurchased((prev) => [
                      ...prev.filter((prod) => prod.id !== i.id),
                      {
                        ...i,
                        isPurchased: true,
                      },
                    ])
                  }
                >
                  <span className="text-[14px] font-medium uppercase -tracking-wider">
                    {i.name}
                  </span>

                  <span className="text-[14px] font-medium">
                    {i.quantity} {i.quantity_suffix}
                  </span>
                </li>
              ))}
            </>
          ) : null}

          {data && data.length === 0 ? (
            <li className="flex flex-col items-center justify-center mb-5 h-[calc(100vh_-_200px)]">
              <Frown className="h-10 w-10 mb-5" />
              <span className="text-[14px] font-medium -tracking-wider">
                Lista vazia, adicione produtos
              </span>
            </li>
          ) : null}
        </ul>
      )}

      {!add ? <FinishPurchase /> : null}
    </>
  )
}
