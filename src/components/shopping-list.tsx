import { Check, Loader2, Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'

import { AddToShoppingListForm } from './add-to-shopping-list-form'

interface Product {
  id: number
  created_at: string
  name: string
  quantity: number
  quantity_suffix: string
}

export function ShoppingList() {
  const [show, setShow] = useState(false)
  const [add, setAdd] = useState(false)
  const [loading, setLoading] = useState(false)

  const [products, setProducts] = useState<Product[]>([])

  const handleDown = useCallback(() => {
    setShow(false)
  }, [])

  function handleConfirmPurchase() {
    supabase
      .from('shopping-list')
      .delete()
      .in(
        'id',
        products.map((i) => i.id),
      )
      .then(() => setShow(false))
  }

  useEffect(() => {
    setLoading(true)

    supabase
      .from('shopping-list')
      .select('*')
      .then((response) => setProducts(response.data as Product[]))
      .then(() => setLoading(false))
  }, [])

  return (
    <>
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

          <span className="text-[13px] font-medium">LISTA DE COMPRAS</span>
        </header>

        {add ? (
          <div className="px-10 sm:px-5">
            <AddToShoppingListForm back={() => setAdd(false)} />
          </div>
        ) : (
          <ul className="px-10 sm:px-5">
            <div className="fixed bottom-5 left-5 right-5 flex items-center justify-center space-x-2.5">
              <button
                onClick={handleConfirmPurchase}
                className="truncate rounded-full flex w-full items-center justify-center border border-zinc-200 -tracking-wide text-[12px] font-medium min-h-[3.5rem] h-14 px-7 text-zinc-800"
              >
                {loading ? (
                  <Loader2 className="animate-spin duration-300 w-4 h-4 mr-2.5 text-zinc-800" />
                ) : (
                  <Check className="w-4 h-4 mr-2.5 text-green-500" />
                )}
                A COMPRA JÁ FOI FEITA?
              </button>
              <button
                onClick={() => setAdd((prev) => !prev)}
                className="rounded-full bg-zinc-200/50 backdrop-blur-lg flex items-center justify-center border border-zinc-800 -tracking-wide text-[12px] font-medium min-h-[3.5rem] h-14 px-7 text-white"
              >
                <Plus className="w-4 h-4 mr-2.5" />
                ADICIONAR
              </button>
            </div>

            {products.map((i) => (
              <li key={i.id} className="flex items-center justify-between mb-5">
                <span className="font-medium capitalize text-xl -tracking-wider">
                  {i.name}
                </span>
                <span className="font-medium capitalize text-xl -tracking-wider">
                  {i.quantity} {i.quantity_suffix}
                </span>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </>
  )
}
