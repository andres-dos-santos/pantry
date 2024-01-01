/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import * as Slider from '@radix-ui/react-slider'

import { supabase } from '../lib/supabase'

import { toast } from '../utils/toast'

import { ProductForm } from './product-form'

import type { Product } from '../types'
import { AddToShoppingListForm } from './add-to-shopping-list-form'

interface Props {
  product: Product
  down(): void
}

export function UpdateProduct({ product, down }: Props) {
  const [show, setShow] = useState(false)
  const [add, setAdd] = useState(false)

  const handleDown = useCallback(() => {
    setShow(false)

    down()
  }, [down])

  function handleUpdateUsage(usage: number) {
    try {
      supabase
        .from('products')
        .update({ usage_quantity: usage })
        .eq('id', product.id)
        .then(() => {
          toast({ message: 'Atualizado com sucesso!', type: 'success' })
        })
    } catch (error) {
      toast({ message: 'Ocorreu um erro!', type: 'error' })
    }
  }

  function handleRemove() {
    try {
      supabase
        .from('products')
        .delete()
        .eq('id', product!.id)
        .then(() => {
          toast({ message: 'Removido com sucesso!', type: 'success' })
        })
    } catch (error) {
      toast({ message: 'Ocorreu um erro', type: 'error' })
    } finally {
      handleDown()
    }
  }

  const back = useCallback(() => setAdd(false), [])

  useEffect(() => product && setShow(true), [product])

  return (
    <>
      <aside
        data-show={show}
        className="data-[show=true]:flex data-[show=false]:invisible transition-all duration-300 data-[show=false]:top-full sm:max-w-[600px] data-[show=true]:top-0 flex-col bg-white fixed right-0 bottom-0 h-screen z-10 w-full sm:border-l border-l-zinc-200"
      >
        <header className="flex items-center justify-between px-10 sm:px-5 my-10">
          <button
            onClick={() =>
              add ? setAdd((prev) => !prev) : setShow((prev) => !prev)
            }
            className="flex items-center justify-center border border-zinc-200 -tracking-wide text-[12px] uppercase font-medium min-h-[2.5rem] h-10 min-w-[2.5rem] w-10 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="text-[13px] font-medium uppercase truncate max-w-[50%]">
            DETALHES DE {product.name}
          </span>
        </header>

        <div className="px-10 sm:px-5 mb-5">
          {add ? (
            <AddToShoppingListForm back={back} product={product} />
          ) : (
            <>
              <div className="p-5 border border-zinc-200 rounded-[5px] mb-5">
                <span className="text-xs mb-1.5 block -tracking-wide font-medium">
                  CONTROLE DE USO{' '}
                </span>

                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  defaultValue={[product.usage_quantity]}
                  max={product.quantity}
                  onValueCommit={(rate) => handleUpdateUsage(rate[0])}
                  step={1}
                >
                  <Slider.Track className="bg-zinc-200 relative grow rounded-full h-[4px]">
                    <Slider.Range className="absolute bg-zinc-200 rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-5 h-5 bg-zinc-900 border border-zinc-900 rounded-[10px] focus:outline-none" />
                </Slider.Root>

                <div
                  data-buy={product.usage_quantity === product.quantity}
                  className="data-[buy=false]:hidden"
                >
                  <button
                    onClick={() => setAdd((prev) => !prev)}
                    className="my-2.5 flex items-center justify-center border border-zinc-200 -tracking-wide text-[12px] uppercase font-medium min-h-[2.5rem] h-10 px-5 rounded-[5px]"
                  >
                    ADICIONAR A LISTA DO PRÓXIMO MÊS
                    <ArrowRight className="w-4 h-4 ml-2.5" />
                  </button>

                  <strong className="text-xs font-medium">
                    Você está usando {product.usage_quantity} de{' '}
                    {product.quantity} {product.quantity_suffix}
                  </strong>
                </div>
              </div>

              <ProductForm onRemove={handleRemove} product={product} />
            </>
          )}
        </div>
      </aside>
    </>
  )
}
