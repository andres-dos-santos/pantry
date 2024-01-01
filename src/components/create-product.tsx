import { ArrowLeft, Plus } from 'lucide-react'
import { useState } from 'react'

import { ProductForm } from './product-form'

export function CreateProduct() {
  const [show, setShow] = useState(false)

  return (
    <>
      <button
        onClick={() => setShow((prev) => !prev)}
        className="flex items-center justify-center border border-zinc-200 -tracking-wide text-[12px] uppercase font-medium min-h-[2.5rem] h-10 min-w-[2.5rem] w-10 rounded-full"
      >
        <Plus className="w-4 h-4" />
      </button>

      <aside
        data-show={show}
        className="data-[show=true]:flex data-[show=false]:invisible transition-all duration-300 data-[show=false]:top-full sm:max-w-[400px] data-[show=true]:top-0 flex-col bg-white fixed right-0 bottom-0 h-screen z-10 w-full sm:border-l border-l-zinc-200"
      >
        <header className="flex items-center justify-between px-10 sm:px-5 my-10">
          <button
            onClick={() => setShow((prev) => !prev)}
            className="flex items-center justify-center border border-zinc-200 -tracking-wide text-[12px] uppercase font-medium min-h-[2.5rem] h-10 min-w-[2.5rem] w-10 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="text-[13px] font-medium">
            ADICIONE UM PRODUTO A SUA DESPENSA
          </span>
        </header>

        <div className="sm:px-5 px-10">
          <ProductForm />
        </div>
      </aside>
    </>
  )
}
