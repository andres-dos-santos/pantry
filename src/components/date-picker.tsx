'use client'

import dayjs from 'dayjs'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import 'dayjs/locale/pt-br'

const currentMonth = dayjs(new Date()).locale('pt-br').format('MMMM')

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export function DatePicker() {
  const [show, setShow] = useState(false)

  const [month, setMonth] = useState(currentMonth)

  return (
    <>
      <button
        onClick={() => setShow((prev) => !prev)}
        className="bg-zinc-900 h-12 w-32 space-x-1.5 flex items-center justify-center rounded-full -tracking-wide"
      >
        <ChevronDown className="h-4 w-4 text-zinc-100" />
        <span className="text-xs font-medium text-zinc-100 capitalize">
          {month.slice(0, 3)}
        </span>
      </button>

      <aside
        data-show={show}
        className="data-[show=true]:flex data-[show=false]:invisible transition-all duration-300 data-[show=false]:top-full sm:max-w-[400px] data-[show=true]:top-0 flex-col bg-white fixed right-0 bottom-0 h-screen z-10 w-full sm:border-l border-l-zinc-200"
      >
        <header className="flex flex-col w-full p-10 sm:p-5 items-center justify-center mb-5">
          <button
            onClick={() => setShow((prev) => !prev)}
            className="flex items-center justify-center h-5 mb-10 w-full"
          >
            <div className="h-[2px] rounded-full w-[25%] bg-zinc-800"></div>
          </button>

          <span className="text-[13px] font-medium">SELECIONE UM MÊS</span>
        </header>

        <ul className="grid grid-cols-3 sm:grid-cols-2 gap-2.5 px-10 sm:px-5">
          {months.map((item) => (
            <li
              key={item}
              onClick={() => setMonth(item)}
              data-month={month.toLowerCase() === item.toLowerCase()}
              className="data-[month=true]:bg-zinc-900 data-[month=true]:text-white bg-zinc-100 rounded-xl h-10 text-xs font-medium flex items-center justify-center -tracking-wide"
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}
